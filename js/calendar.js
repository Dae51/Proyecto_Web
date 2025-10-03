
/* Se declara el objeto calendario de la libreria FullCalendar*/
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es', // idioma español
    events: [
      {
        title: 'Evento de prueba',
        start: '2025-10-10',
        end: '2025-10-12'
      },
      {
        title: 'Reunión importante',
        start: '2025-10-15T14:00:00'
      }
    ]
  });

  calendar.render();
});
