document.addEventListener('DOMContentLoaded', function() {
    var result = document.getElementById('result');
    var queryIdEl = document.getElementById('queryId');
    var favorites = result ? result.querySelectorAll('.favorite') : [];
    var searchButton = document.getElementById('searchButton');
    var contextPath = document.getElementById('contextPath');
    var contextPathVal = contextPath ? contextPath.value : '';

    var searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function() {
            if (searchButton) {
                searchButton.disabled = true;
                setTimeout(function() {
                    searchButton.disabled = false;
                }, 3000);
            }
            return true;
        });
    }

    var contentEl = document.getElementById('content');
    if (contentEl) {
        var closeSearchOptions = function(e) {
            if (!e.target.closest('#searchOptions, [data-toggle="control-options"]')) {
                var el = document.getElementById('searchOptions');
                if (el) {
                    el.classList.remove('active');
                }
            }
        };
        contentEl.addEventListener('click', closeSearchOptions);
        contentEl.addEventListener('touchend', closeSearchOptions);
    }

    var controlOptionsBtns = document.querySelectorAll('[data-toggle="control-options"]');
    for (var i = 0; i < controlOptionsBtns.length; i++) {
        controlOptionsBtns[i].addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('data-target') || this.getAttribute('href');
            if (target) {
                var targetEl = document.querySelector(target);
                if (targetEl) {
                    targetEl.classList.toggle('active');
                }
            }
        });
    }

    var clearBtn = document.getElementById('searchOptionsClearButton');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            var labelType = document.getElementById('labelTypeSearchOption');
            if (labelType) {
                labelType.selectedIndex = -1;
            }
            ['langSearchOption', 'sortSearchOption', 'numSearchOption'].forEach(function(id) {
                var sel = document.getElementById(id);
                if (sel) {
                    sel.selectedIndex = 0;
                }
            });
            return false;
        });
    }

    // Result link tracking - mousedown on a.link
    if (result) {
        result.addEventListener('mousedown', function(e) {
            var link = e.target.closest('a.link');
            if (!link) {
                return;
            }
            var docId = link.getAttribute('data-id');
            var rt = document.getElementById('rt');
            var rtVal = rt ? rt.value : '';
            var queryId = queryIdEl ? queryIdEl.value : '';
            var order = link.getAttribute('data-order');
            var href = link.getAttribute('href');
            var parts = [];
            parts.push(contextPathVal);
            parts.push('/go/?rt=');
            parts.push(rtVal);
            parts.push('&docId=');
            parts.push(docId);
            parts.push('&queryId=');
            parts.push(queryId);
            parts.push('&order=');
            parts.push(order);
            var hashIndex = href.indexOf('#');
            if (hashIndex >= 0) {
                var hash = href.substring(hashIndex);
                parts.push('&hash=');
                parts.push(encodeURIComponent(hash));
            }
            link.setAttribute('href', parts.join(''));
        });

        // Result link tracking - mouseover on a.link
        result.addEventListener('mouseover', function(e) {
            var link = e.target.closest('a.link');
            if (!link) {
                return;
            }
            var docId = link.getAttribute('data-id');
            var rt = document.getElementById('rt');
            var rtVal = rt ? rt.value : '';
            var href = link.getAttribute('href');
            var parts = [];
            parts.push(contextPathVal);
            parts.push('/go/?rt=');
            parts.push(rtVal);
            parts.push('&docId=');
            parts.push(docId);
            var hashIndex = href.indexOf('#');
            if (hashIndex >= 0) {
                var hash = href.substring(hashIndex);
                parts.push('&hash=');
                parts.push(encodeURIComponent(hash));
                parts.push(hash);
            }
        });

        // Favorite click handler
        result.addEventListener('click', function(e) {
            var favLink = e.target.closest('a.favorite');
            if (!favLink) {
                return;
            }
            e.preventDefault();
            var hrefParts = favLink.getAttribute('href').split('#');
            if (hrefParts.length === 2 && queryIdEl) {
                var jsonUrl = contextPathVal + '/json';
                var docId = hrefParts[1];
                fetch(jsonUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'type=favorite&docId=' + encodeURIComponent(docId) + '&queryId=' + encodeURIComponent(queryIdEl.value)
                })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.response.status === 0 && typeof data.response.result !== 'undefined' && data.response.result === 'ok') {
                        var favorited = favLink.parentElement.querySelector('.favorited');
                        if (favorited) {
                            var countEl = favorited.querySelector('.favorited-count');
                            if (countEl) {
                                countEl.style.display = 'none';
                            }
                            favLink.style.transition = 'opacity 1s';
                            favLink.style.opacity = '0';
                            setTimeout(function() {
                                favLink.style.display = 'none';
                                favorited.style.display = '';
                                favorited.style.opacity = '0';
                                favorited.style.transition = 'opacity 1s';
                                setTimeout(function() {
                                    favorited.style.opacity = '1';
                                }, 10);
                            }, 1000);
                        }
                    }
                })
                .catch(function() {
                    favLink.setAttribute('href', '#' + docId);
                });
            }
            favLink.setAttribute('href', '#');
            return false;
        });

        // More info toggle
        result.addEventListener('click', function(e) {
            var moreLink = e.target.closest('.more a');
            if (!moreLink) {
                return;
            }
            e.preventDefault();
            var href = moreLink.getAttribute('href');
            if (href) {
                var info = document.querySelector(href + ' .info');
                if (info) {
                    moreLink.style.transition = 'opacity 0.5s';
                    moreLink.style.opacity = '0';
                    setTimeout(function() {
                        moreLink.style.display = 'none';
                        info.style.display = 'block';
                    }, 500);
                }
            }
            return false;
        });
    }

    // Load favorite states
    if (favorites.length > 0 && queryIdEl) {
        fetch(contextPathVal + '/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'type=favorites&queryId=' + encodeURIComponent(queryIdEl.value)
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.response.status === 0 && typeof data.response.num !== 'undefined' && data.response.num > 0) {
                var docIds = data.response.doc_ids;
                for (var g = 0; g < docIds.length; g++) {
                    docIds[g] = '#' + docIds[g];
                }
                for (var idx = 0; idx < favorites.length; idx++) {
                    var fav = favorites[idx];
                    var favHref = fav.getAttribute('href');
                    var found = false;
                    for (var m = 0; m < docIds.length; m++) {
                        if (favHref === docIds[m]) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        (function(favEl) {
                            var favorited = favEl.parentElement.querySelector('.favorited');
                            if (favorited) {
                                favEl.style.transition = 'opacity 1s';
                                favEl.style.opacity = '0';
                                setTimeout(function() {
                                    favEl.style.display = 'none';
                                    favorited.style.display = '';
                                    favorited.style.opacity = '0';
                                    favorited.style.transition = 'opacity 1s';
                                    setTimeout(function() {
                                        favorited.style.opacity = '1';
                                    }, 10);
                                }, 1000);
                            }
                        })(fav);
                    }
                }
            }
        })
        .catch(function() {});
    }

    // Suggestor init
    if (typeof Suggestor === 'function') {
        var queryEl = document.getElementById('query');
        if (queryEl) {
            var langEl = document.getElementById('langSearchOption');
            new Suggestor(queryEl, {
                ajaxinfo: {
                    url: contextPathVal + '/suggest',
                    fn: '_default,content,title',
                    num: 10,
                    lang: langEl ? langEl.value : ''
                },
                boxCssInfo: {
                    'border': '1px solid rgba(82, 168, 236, 0.5)',
                    '-webkit-box-shadow': '0 1px 1px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(82, 168, 236, 0.2)',
                    '-moz-box-shadow': '0 1px 1px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(82, 168, 236, 0.2)',
                    'box-shadow': '0 1px 1px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(82, 168, 236, 0.2)',
                    'background-color': '#fff',
                    'z-index': '10000'
                },
                listSelectedCssInfo: {
                    'background-color': 'rgba(82, 168, 236, 0.1)'
                },
                listDeselectedCssInfo: {
                    'background-color': '#ffffff'
                },
                minterm: 1,
                adjustWidthVal: 11,
                searchForm: searchForm
            });
        }
    }

    // Thumbnail lazy loading
    var IMG_LOADING_DELAY = 200;
    var IMG_LOADING_MAX = 0;

    var loadImage = function(imgEl, src, retries) {
        var img = new Image();
        img.onload = function() {
            imgEl.style.backgroundImage = '';
            imgEl.setAttribute('src', src);
        };
        img.onerror = function() {
            if (retries > 0) {
                setTimeout(function() {
                    loadImage(imgEl, src, --retries);
                }, IMG_LOADING_DELAY);
            } else {
                var parent = imgEl.parentElement;
                if (parent && parent.parentElement) {
                    parent.parentElement.style.display = 'none';
                }
            }
            img = null;
        };
        img.src = src;
    };

    var thumbnails = document.querySelectorAll('img.thumbnail');
    for (var t = 0; t < thumbnails.length; t++) {
        thumbnails[t].style.backgroundImage = 'url("' + contextPathVal + '/images/loading.gif")';
        loadImage(thumbnails[t], thumbnails[t].getAttribute('data-src'), IMG_LOADING_MAX);
    }
});
