
const TOOLTIP = ``


/* Se declara el objeto calendario de la libreria FullCalendar*/
document.addEventListener('DOMContentLoaded', function () {

    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: '',
            center: 'title',
            end: 'today prevYear,prev,next,nextYear'
        },
/*         eventMouseEnter: function (info) {
            var tooltip = new TOOLTIP
        }, */
        locale: 'es', // idioma español
        events: [
            {
                title: 'Evento de prueba',
                start: '2025-10-10',
                end: '2025-10-12'
            },
            {
                title: 'Live Aid',
                start: '2025-10-14T14:00:00'
            }
        ]
    });

    calendar.render();
});
