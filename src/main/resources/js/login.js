document.addEventListener('DOMContentLoaded', function() {
    // Focus the first input in login-box or section.content
    var containers = document.querySelectorAll('.login-box, section.content');
    for (var i = 0; i < containers.length; i++) {
        var firstInput = containers[i].querySelector('input[type="text"], select, textarea');
        if (firstInput) {
            firstInput.focus();
            break;
        }
    }

    // Focus input next to first .has-error element
    var hasError = document.querySelector('.form-group .has-error');
    if (hasError) {
        var nextInput = hasError.nextElementSibling;
        while (nextInput) {
            if (nextInput.matches('input, select, textarea')) {
                nextInput.focus();
                break;
            }
            nextInput = nextInput.nextElementSibling;
        }
    }

    // Enter key submission in section.content inputs
    var sectionInputs = document.querySelectorAll('section.content input');
    for (var j = 0; j < sectionInputs.length; j++) {
        sectionInputs[j].addEventListener('keypress', function(e) {
            if (e.which === 13) {
                var submitBtn = document.querySelector('input#submit, button#submit');
                if (submitBtn) {
                    submitBtn.click();
                }
                return false;
            }
        });
    }

    // Table row click navigation
    var rows = document.querySelectorAll('.table tr[data-href]');
    for (var k = 0; k < rows.length; k++) {
        (function(row) {
            row.style.cursor = 'pointer';
            row.addEventListener('mouseenter', function() {
                this.classList.add('active');
            });
            row.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
            row.addEventListener('click', function() {
                document.location = this.getAttribute('data-href');
            });
        })(rows[k]);
    }
});
