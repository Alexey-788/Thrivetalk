{
    var headerTopClassName = 'header__top';
    var headerTop = document.getElementsByClassName(headerTopClassName)[0];

    var menuButtonClassName = 'menu-button';
    var menuButton = document.getElementsByClassName(menuButtonClassName)[0];

    menuButton.addEventListener('click', function (e) {
        headerTop.classList.toggle(headerTopClassName + '--active');
    });
}






