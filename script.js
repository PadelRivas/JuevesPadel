document.addEventListener('DOMContentLoaded', () => {
    // Función para cambiar de pestaña
    window.openTab = (tabName) => {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.style.display = 'none');
        const activeTab = document.getElementById(tabName);
        activeTab.style.display = 'block';

        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
    };

    // Abre la primera pestaña por defecto
    openTab('general');

    // **Leer los datos del JSON incrustado en el HTML**
    const datosScript = document.getElementById('datos');
    const data = JSON.parse(datosScript.textContent);

    // Renderizar estadísticas generales
    document.getElementById('mostActivePlayer').textContent = data.generalStats.jugadorMasActivo;

    // Crear gráfico con Chart.js
    const ctx = document.getElementById('partidosJugadosChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
            datasets: [{
                label: 'Partidos Jugados',
                data: data.generalStats.partidosPorMes,
                backgroundColor: 'rgba(0, 200, 83, 0.7)',
                borderColor: 'rgba(0, 200, 83, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: '#333' } },
                x: { grid: { color: '#333' } }
            }
        }
    });

    // Renderizar tabla de clasificación
    const rankingBody = document.getElementById('rankingTableBody');
    data.ranking.forEach((pareja, index) => {
        const row = rankingBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${pareja.jugador1} / ${pareja.jugador2}</td>
            <td>${pareja.ganados}</td>
            <td>${pareja.perdidos}</td>
        `;
    });

    // Renderizar lista de partidos
    const partidosList = document.getElementById('partidosList');
    data.partidos.forEach(partido => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <h4>Partido #${partido.id_partido} - ${partido.fecha}</h4>
            <p>${partido.pareja1} vs ${partido.pareja2}</p>
            <strong>Resultado: ${partido.resultado}</strong>
        `;
        partidosList.appendChild(matchCard);
    });
});