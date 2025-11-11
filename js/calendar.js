
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    let currentYear = 2025;

    // Actualizar día actual en sidebar
    const today = new Date();
    document.getElementById('currentDay').textContent = today.getDate();
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    document.getElementById('currentDayName').textContent = days[today.getDay()];

    // Inicializar calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: false,
        locale: 'es',
        events: [
            {
                title: 'Evento de prueba',
                start: '2025-10-10',
                end: '2025-10-12',
                backgroundColor: '#6a0dad',
                borderColor: '#6a0dad'
            },
            {
                title: 'Live Aid',
                start: '2025-10-14T14:00:00',
                backgroundColor: '#8b5cf6',
                borderColor: '#8b5cf6'
            }
        ],
        eventClick: function (info) {
            alert('Evento: ' + info.event.title);
        }
    });

    calendar.render();

    // Navegación de meses
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNav = document.getElementById('monthNav');

    months.forEach((month, index) => {
        const btn = document.createElement('button');
        btn.className = 'month-btn';
        btn.textContent = month;
        if (index === today.getMonth()) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            calendar.gotoDate(new Date(currentYear, index, 1));
            document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        monthNav.appendChild(btn);
    });

    // Navegación de año
    document.getElementById('currentYear').textContent = currentYear;

    document.getElementById('prevYear').addEventListener('click', () => {
        currentYear--;
        document.getElementById('currentYear').textContent = currentYear;
        calendar.gotoDate(new Date(currentYear, calendar.getDate().getMonth(), 1));
    });

    document.getElementById('nextYear').addEventListener('click', () => {
        currentYear++;
        document.getElementById('currentYear').textContent = currentYear;
        calendar.gotoDate(new Date(currentYear, calendar.getDate().getMonth(), 1));
    });
});