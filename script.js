document.getElementById('themeToggle').addEventListener('click', function () {
    const currentTheme = document.body.className;
    const ThemeIcon = document.getElementById('ThemeIcon');
    if (currentTheme === 'light-theme') {
        document.body.className = 'dark-theme';
        ThemeIcon.src = "photos/sun.svg";
    } else {
        document.body.className = 'light-theme';
        ThemeIcon.src = "photos/moon.svg";
    }
});

const checkboxes = document.querySelectorAll('.task');

checkboxes.forEach(checkbox => {
    const checkboxText = checkbox.querySelector('.task_text') ||
        checkbox.nextElementSibling;

    checkbox.addEventListener("click", function () {
        if (this.checked) {
            checkboxText.style.textDecoration = 'line-through';
        } else {
            checkboxText.style.textDecoration = 'none';
            }
    });
});


