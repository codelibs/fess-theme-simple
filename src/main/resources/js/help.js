document.addEventListener('DOMContentLoaded', function() {
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
});
