document.getElementById('themeToggle').addEventListener('click', function(){
    const currentTheme = document.body.className;
    const ThemeIcon = document.getElementById('ThemeIcon');
    if(currentTheme === 'light-theme'){
        document.body.className = 'dark-theme';
        ThemeIcon.src = "sun.svg";
    } else {
        document.body.className = 'light-theme';
        ThemeIcon.src = "moon.svg";
    }
});