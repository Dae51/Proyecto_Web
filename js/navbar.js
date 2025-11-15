// Navbar responsivo - Menú hamburguesa

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbarMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Abrir/cerrar menú hamburguesa
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = hamburger && hamburger.contains(event.target);
        const isClickInsideMenu = navbarMenu && navbarMenu.contains(event.target);
        
        if (!isClickInsideNavbar && !isClickInsideMenu) {
            if (hamburger) hamburger.classList.remove('active');
            if (navbarMenu) navbarMenu.classList.remove('active');
        }
    });
});
