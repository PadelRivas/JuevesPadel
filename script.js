document.addEventListener('DOMContentLoaded', () => {
    window.openTab = (tabName) => {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.style.display = 'none');
        const activeTab = document.getElementById(tabName);
        activeTab.style.display = 'block';

        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
    };

    openTab('general');

    const datosScript = document.getElementById('datos');
    const data = JSON.parse(datosScript.textContent);

    document.getElementById('mostActivePlayer').textContent = data.generalStats.jugadorMasActivo;

    const ctx = document.getElementById('partidosJugadosChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
            datasets: [{
                label: 'Partidos Jugados',
                data: data.generalStats.partidosPorMes,
                backgroundColor: 'rgba(0, 113, 227, 0.7)',
                borderColor: 'rgba(0, 113, 227, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: '#e0e0e0' } },
                x: { grid: { color: '#e0e0e0' } }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Renderizar tabla de clasificación individual
	const rankingBody = document.getElementById('rankingTableBody');
	rankingBody.innerHTML = ''; // Limpiar cualquier contenido anterior
	data.rankingIndividual.forEach((jugador, index) => {
		const row = rankingBody.insertRow();
		row.innerHTML = `
			<td>${index + 1}</td>
			<td>${jugador.nombre}</td>
			<td>${jugador.pj}</td>
			<td>${jugador.pg}</td>
			<td>${jugador.pe}</td>
			<td>${jugador.pp}</td>
			<td>${jugador.puntos_totales}</td>
			<td>${jugador.puntos_por_partido}</td>
		`;
	});

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