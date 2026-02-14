function Suggestor(element, options) {
    var suggestBox;
    var inputEl;
    var savedVal = '';
    var isSelecting = false;
    var totalItems = 0;
    var currentIndex = 0;
    var isMouseOverBox = false;
    var isCharInput = false;
    var throttleCount = 5;
    var minterm = 1;
    var ajaxinfo;
    var adjustWidthVal;
    var searchForm;
    var listSelectedCssInfo;
    var listDeselectedCssInfo;
    var boxCssInfo;
    var isSuggesting = false;
    var jsonpCounter = 0;

    function jsonpFetch(url, params, successCallback, failCallback) {
        var callbackName = '_suggestorCallback' + (++jsonpCounter) + '_' + Date.now();
        var query = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var val = params[key];
                if (Array.isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(val[i]));
                    }
                } else {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
                }
            }
        }
        query.push('callback=' + callbackName);
        query.push('_=' + Date.now());
        var src = url + '?' + query.join('&');

        window[callbackName] = function(data) {
            delete window[callbackName];
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            successCallback(data);
        };

        var script = document.createElement('script');
        script.src = src;
        script.onerror = function() {
            delete window[callbackName];
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            if (failCallback) {
                failCallback();
            }
        };
        document.head.appendChild(script);
    }

    function getDeselectedBg() {
        if (listDeselectedCssInfo && listDeselectedCssInfo['background-color']) {
            return listDeselectedCssInfo['background-color'];
        }
        if (boxCssInfo && boxCssInfo['background-color']) {
            return boxCssInfo['background-color'];
        }
        return '#ffffff';
    }

    function applyDeselectedStyle(el) {
        if (listDeselectedCssInfo) {
            for (var prop in listDeselectedCssInfo) {
                if (listDeselectedCssInfo.hasOwnProperty(prop)) {
                    el.style[cssPropToJs(prop)] = listDeselectedCssInfo[prop];
                }
            }
        } else {
            el.style.backgroundColor = getDeselectedBg();
        }
    }

    function applySelectedStyle(el) {
        if (listSelectedCssInfo) {
            for (var prop in listSelectedCssInfo) {
                if (listSelectedCssInfo.hasOwnProperty(prop)) {
                    el.style[cssPropToJs(prop)] = listSelectedCssInfo[prop];
                }
            }
        } else {
            el.style.backgroundColor = '#e5e5e5';
        }
    }

    function cssPropToJs(prop) {
        return prop.replace(/-([a-z])/g, function(match, letter) {
            return letter.toUpperCase();
        });
    }

    function init(el, opts) {
        isSuggesting = false;
        suggestBox = document.createElement('div');
        suggestBox.className = 'suggestorBox';
        suggestBox.style.display = 'none';
        suggestBox.style.position = 'absolute';
        suggestBox.style.textAlign = 'left';

        var computedStyle = window.getComputedStyle(el);
        suggestBox.style.fontSize = computedStyle.fontSize;

        if (typeof opts.boxCssInfo === 'undefined') {
            suggestBox.style.border = '1px solid #cccccc';
            suggestBox.style.webkitBoxShadow = '0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)';
            suggestBox.style.MozBoxShadow = '0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)';
            suggestBox.style.boxShadow = '0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)';
            suggestBox.style.backgroundColor = '#fff';
        } else {
            for (var prop in opts.boxCssInfo) {
                if (opts.boxCssInfo.hasOwnProperty(prop)) {
                    suggestBox.style[cssPropToJs(prop)] = opts.boxCssInfo[prop];
                }
            }
        }

        inputEl = el;
        inputEl.setAttribute('autocomplete', 'off');
        isSelecting = false;
        savedVal = inputEl.value;
        ajaxinfo = opts.ajaxinfo;
        minterm = opts.minterm;
        searchForm = opts.searchForm;
        listSelectedCssInfo = opts.listSelectedCssInfo;
        listDeselectedCssInfo = opts.listDeselectedCssInfo;
        adjustWidthVal = opts.adjustWidthVal;
        boxCssInfo = opts.boxCssInfo;

        suggestBox.addEventListener('mouseenter', function() {
            isMouseOverBox = true;
        });
        suggestBox.addEventListener('mouseleave', function() {
            isMouseOverBox = false;
        });

        resize();

        window.addEventListener('resize', function() {
            resize();
        });

        document.body.appendChild(suggestBox);
    }

    function suggest() {
        isSuggesting = true;
        resize();
        savedVal = inputEl.value;
        totalItems = 0;
        currentIndex = 0;
        if (savedVal.length < minterm) {
            suggestBox.style.display = 'none';
            isSuggesting = false;
            return;
        }

        jsonpFetch(
            ajaxinfo.url,
            {
                query: inputEl.value,
                fields: ajaxinfo.fn,
                num: ajaxinfo.num * 2,
                lang: ajaxinfo.lang
            },
            function(data) {
                createAutoCompleteList(data);
            },
            function() {
                isSuggesting = false;
            }
        );
    }

    function createAutoCompleteList(data) {
        if (data.response.status !== 0) {
            suggestBox.style.display = 'none';
            return;
        }

        var hits = data.response.result.hits;
        totalItems = 0;

        if (typeof hits !== 'undefined') {
            var texts = [];
            for (var c = 0; c < hits.length; c++) {
                texts.push(hits[c].text);
            }

            var ol = document.createElement('ol');
            ol.style.listStyle = 'none';
            ol.style.padding = '0';
            ol.style.margin = '2px';

            for (var z = 0; z < texts.length && totalItems < ajaxinfo.num; z++) {
                var text = texts[z];
                var isDuplicate = false;
                var existingItems = ol.querySelectorAll('li');
                for (var x = 0; x < existingItems.length; x++) {
                    if (text === existingItems[x].textContent) {
                        isDuplicate = true;
                    }
                }

                if (!isDuplicate) {
                    var li = document.createElement('li');
                    li.textContent = text;

                    li.addEventListener('click', (function(liEl) {
                        return function() {
                            var val = liEl.textContent;
                            fixList();
                            inputEl.value = val;
                            if (typeof searchForm !== 'undefined') {
                                searchForm.submit();
                            }
                        };
                    })(li));

                    li.addEventListener('mouseenter', (function(liEl) {
                        return function() {
                            var parentOl = liEl.closest('ol');
                            var siblings = parentOl.querySelectorAll('li');
                            var idx = Array.prototype.indexOf.call(siblings, liEl);
                            currentIndex = idx + 1;
                            for (var i = 0; i < siblings.length; i++) {
                                if (i === currentIndex - 1) {
                                    applySelectedStyle(siblings[i]);
                                } else {
                                    applyDeselectedStyle(siblings[i]);
                                }
                            }
                        };
                    })(li));

                    li.addEventListener('mouseleave', (function(liEl) {
                        return function() {
                            var parentOl = liEl.closest('ol');
                            var siblings = parentOl.querySelectorAll('li');
                            var idx = Array.prototype.indexOf.call(siblings, liEl);
                            if (currentIndex === idx + 1) {
                                applyDeselectedStyle(liEl);
                                currentIndex = 0;
                            }
                        };
                    })(li));

                    li.style.padding = '2px';
                    ol.appendChild(li);
                    totalItems++;
                }
            }

            if (totalItems > 0 && inputEl.value.length >= minterm) {
                while (suggestBox.firstChild) {
                    suggestBox.removeChild(suggestBox.firstChild);
                }
                suggestBox.appendChild(ol);
                suggestBox.style.display = 'block';
            } else {
                suggestBox.style.display = 'none';
            }
        } else {
            suggestBox.style.display = 'none';
        }

        resize();
        isSuggesting = false;
    }

    function selectlist(direction) {
        if (suggestBox.style.display === 'none') {
            return;
        }

        if (direction === 'down') {
            currentIndex++;
        } else if (direction === 'up') {
            currentIndex--;
        } else {
            return;
        }

        isSelecting = true;

        if (currentIndex < 0) {
            currentIndex = totalItems;
        } else if (currentIndex > totalItems) {
            currentIndex = 0;
        }

        var items = suggestBox.querySelectorAll('ol > li');
        for (var i = 0; i < items.length; i++) {
            if (i === currentIndex - 1) {
                applySelectedStyle(items[i]);
                inputEl.value = items[i].textContent;
            } else {
                applyDeselectedStyle(items[i]);
            }
        }

        if (currentIndex === 0) {
            inputEl.value = savedVal;
        }
    }

    function fixList() {
        if (currentIndex > 0) {
            var items = suggestBox.querySelectorAll('ol > li');
            if (items[currentIndex - 1]) {
                inputEl.value = items[currentIndex - 1].textContent;
            }
        }
        savedVal = inputEl.value;
        isSelecting = false;
        suggestBox.style.display = 'none';
        totalItems = 0;
    }

    function resize() {
        var rect = inputEl.getBoundingClientRect();
        suggestBox.style.top = (rect.top + window.scrollY + inputEl.offsetHeight + 6) + 'px';
        suggestBox.style.left = (rect.left + window.scrollX) + 'px';
        suggestBox.style.height = 'auto';
        suggestBox.style.width = 'auto';
        if (suggestBox.offsetWidth < inputEl.offsetWidth + adjustWidthVal) {
            suggestBox.style.width = (inputEl.offsetWidth + adjustWidthVal) + 'px';
        }
    }

    // Initialize
    init(element, options);

    // Keydown handler
    element.addEventListener('keydown', function(e) {
        if ((e.keyCode >= 48 && e.keyCode <= 90) ||
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            (e.keyCode >= 186 && e.keyCode <= 226) ||
            e.keyCode === 8 || e.keyCode === 32 || e.keyCode === 46) {
            isCharInput = true;
            isSelecting = false;
        } else if (e.keyCode === 38) {
            if (suggestBox.style.display !== 'none') {
                e.preventDefault();
            }
            selectlist('up');
        } else if (e.keyCode === 40) {
            if (suggestBox.style.display === 'none') {
                suggest();
            } else {
                selectlist('down');
            }
        } else if (e.keyCode === 13) {
            if (isSelecting) {
                fixList();
            }
        }
    });

    // Keyup handler
    element.addEventListener('keyup', function(e) {
        if ((e.keyCode >= 48 && e.keyCode <= 90) ||
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            (e.keyCode >= 186 && e.keyCode <= 226) ||
            e.keyCode === 8 || e.keyCode === 32 || e.keyCode === 46) {
            isCharInput = true;
            isSelecting = false;
        }
    });

    // Blur handler
    element.addEventListener('blur', function() {
        if (!isMouseOverBox) {
            fixList();
        }
    });

    // Polling interval for auto-suggest
    setInterval(function() {
        if (throttleCount < 5) {
            throttleCount = throttleCount + 1;
        } else {
            if (inputEl.value !== savedVal) {
                if (!isSelecting && isCharInput && !isSuggesting) {
                    suggest();
                    throttleCount = 0;
                }
            }
        }
    }, 100);
}
