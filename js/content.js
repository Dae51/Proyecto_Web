
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.nav-admin .btn-link');
    const sections = document.querySelectorAll('main .section');
    const titulo = document.getElementById('titulo-seccion');

    function hideAll() {
        sections.forEach(s => s.style.display = 'none');
    }

    function showSection(id) {
        hideAll();
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'block';
            titulo.textContent = {
                integrantes: 'Gestionar Integrantes',
                presentaciones: 'Gestionar Presentaciones',
                discografia: 'Gestionar Discografía',
                noticas: 'Noticias Actualizadas',
                config: 'Configuración del panel'
            }[id] || 'Panel Administrativo';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    links.forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const sec = a.getAttribute('data-section');
            showSection(sec);
        });
    });

    showSection('integrantes');
});