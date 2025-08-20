document.addEventListener('DOMContentLoaded', () => {
    if (typeof appData === 'undefined') {
        console.error('Los datos del backend no se han cargado (appData no está definido).');
        return;
    }

    const players = appData.jugadores;
    const matches = appData.partidos;
    const sets = appData.sets;
    const results = appData.resultados;
    const couples = appData.parejas;
    const match_couples = appData.partido_pareja;

    // Almacena los colores asignados a cada jugador para consistencia
    const playerColors = {};

    const getRandomColor = (playerName) => {
        if (playerColors[playerName]) {
            return playerColors[playerName];
        }
        
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        
        playerColors[playerName] = color;
        return color;
    };

    const tabs = document.querySelectorAll('.tab-button');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });

            if (targetId === 'ranking') {
                renderRanking();
            } else if (targetId === 'player') {
                renderPlayerProfile();
            } else if (targetId === 'metrics') {
                renderMetrics();
            } else if (targetId === 'history') {
                renderHistory();
            }
        });
    });
    
    const calculatePlayerPoints = (playerId, matchId) => {
        const matchResult = results.find(r => r.id_partido === matchId);
        if (!matchResult || matchResult.equipo_ganador === -1) {
            return 0;
        }

        const matchSets = sets.filter(s => s.id_partido === matchId);
        const playerMatchCouple = match_couples.find(mp => {
            const pair = couples.find(p => p.id_pareja === mp.id_pareja);
            return pair && (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId) && mp.id_partido === matchId;
        });

        if (!playerMatchCouple) return 0;

        const playerTeam = playerMatchCouple.equipo;
        const isWinner = matchResult.equipo_ganador === playerTeam;
        const isTie = matchResult.equipo_ganador === 0;

        if (isWinner) {
            return 20;
        } else if (isTie) {
            let totalGamesWon = 0;
            matchSets.forEach(s => {
                if (playerTeam === 1) totalGamesWon += s.juegos_equipo1;
                else totalGamesWon += s.juegos_equipo2;
            });
            return totalGamesWon;
        } else {
            let totalGamesWon = 0;
            matchSets.forEach(s => {
                if (playerTeam === 1) totalGamesWon += s.juegos_equipo1;
                else totalGamesWon += s.juegos_equipo2;
            });
            return totalGamesWon;
        }
    };

    const getPlayerStats = () => {
        const playerStatsMap = new Map();

        players.forEach(player => {
            playerStatsMap.set(player.id_jugador, {
                ...player,
                matchesPlayed: 0,
                wins: 0,
                losses: 0,
                ties: 0,
                totalPoints: 0,
                pointsPerMatch: 0,
                currentWinStreak: 0,
                maxWinStreak: 0,
                currentLossStreak: 0,
                maxLossStreak: 0,
                setsWon: 0,
                setsLost: 0,
                gamesWon: 0,
                gamesLost: 0,
                matchHistory: []
            });
        });

        const playedMatches = matches.filter(match => {
            const matchResult = results.find(r => r.id_partido === match.id_partido);
            return matchResult && matchResult.equipo_ganador !== -1;
        }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        playedMatches.forEach(match => {
            const matchCouples = match_couples.filter(mp => mp.id_partido === match.id_partido);
            const matchResult = results.find(r => r.id_partido === match.id_partido);

            matchCouples.forEach(mp => {
                const couple = couples.find(p => p.id_pareja === mp.id_pareja);
                const playersInCouple = [couple.id_jugador1, couple.id_jugador2];

                playersInCouple.forEach(playerId => {
                    const stats = playerStatsMap.get(playerId);
                    if (!stats) return;

                    stats.matchesPlayed++;
                    const points = calculatePlayerPoints(playerId, match.id_partido);
                    stats.totalPoints += points;
                    
                    if (matchResult.equipo_ganador === mp.equipo) {
                        stats.wins++;
                        stats.currentWinStreak++;
                        stats.currentLossStreak = 0;
                    } else if (matchResult.equipo_ganador === 0) {
                        stats.ties++;
                        stats.currentWinStreak = 0;
                        stats.currentLossStreak = 0;
                    } else {
                        stats.losses++;
                        stats.currentLossStreak++;
                        stats.currentWinStreak = 0;
                    }

                    if (stats.currentWinStreak > stats.maxWinStreak) {
                        stats.maxWinStreak = stats.currentWinStreak;
                    }
                    if (stats.currentLossStreak > stats.maxLossStreak) {
                        stats.maxLossStreak = stats.currentLossStreak;
                    }

                    const matchSets = sets.filter(s => s.id_partido === match.id_partido);
                    matchSets.forEach(s => {
                        if (mp.equipo === 1) {
                            if (s.juegos_equipo1 > s.juegos_equipo2) stats.setsWon++; else stats.setsLost++;
                            stats.gamesWon += s.juegos_equipo1;
                            stats.gamesLost += s.juegos_equipo2;
                        } else {
                            if (s.juegos_equipo2 > s.juegos_equipo1) stats.setsWon++; else stats.setsLost++;
                            stats.gamesWon += s.juegos_equipo2;
                            stats.gamesLost += s.juegos_equipo1;
                        }
                    });
                });
            });
        });

        const finalStats = Array.from(playerStatsMap.values()).map(stats => ({
            ...stats,
            pointsPerMatch: stats.matchesPlayed > 0 ? (stats.totalPoints / stats.matchesPlayed) : 0
        }));

        return finalStats;
    };

    const playersStats = getPlayerStats();

    const renderRanking = () => {
        const sortedPlayers = [...playersStats].sort((a, b) => b.pointsPerMatch - a.pointsPerMatch);
        const container = document.getElementById('ranking-container');

        const tableContent = sortedPlayers.map((player, index) => {
            let medal = '';
            if (index === 0) {
                medal = '🥇';
            } else if (index === 1) {
                medal = '🥈';
            } else if (index === 2) {
                medal = '🥉';
            }
            
            return `
                <tr>
                    <td data-label="Posición">${index + 1} ${medal}</td>
                    <td data-label="Nombre">${player.nombre}</td>
                    <td data-label="Puntos por Partido">${player.pointsPerMatch.toFixed(2)}</td>
                    <td data-label="Puntos Totales">${player.totalPoints}</td>
                    <td data-label="Partidos Jugados">${player.matchesPlayed}</td>
                    <td data-label="Ganados">${player.wins}</td>
                    <td data-label="Empatados">${player.ties}</td>
                    <td data-label="Perdidos">${player.losses}</td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Nombre</th>
                        <th>Puntos por Partido</th>
                        <th>Puntos Totales</th>
                        <th>Partidos Jugados</th>
                        <th>Ganados</th>
                        <th>Empatados</th>
                        <th>Perdidos</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        `;
    };

    const playerSelect = document.getElementById('player-select');
    
    const renderPlayerProfile = (playerId) => {
        const player = playersStats.find(p => p.id_jugador === playerId);
        if (!player) {
            document.getElementById('player-profile-container').innerHTML = `<p>Selecciona un jugador para ver sus estadísticas.</p>`;
            return;
        }

        const setDifference = player.setsWon - player.setsLost;
        const gameDifference = player.gamesWon - player.gamesLost;

        const container = document.getElementById('player-profile-container');
        container.innerHTML = `
            <h3>Resumen de Rendimiento</h3>
            <p><strong>Puntos totales:</strong> ${player.totalPoints}</p>
            <p><strong>Puntos por partido:</strong> ${player.pointsPerMatch.toFixed(2)}</p>
            <p><strong>Partidos jugados:</strong> ${player.matchesPlayed}</p>
            <p><strong>Racha de victorias más larga:</strong> ${player.maxWinStreak}</p>
            <p><strong>Racha de derrotas más larga:</strong> ${player.maxLossStreak}</p>

            <hr>

            <h3>Detalle de Sets y Juegos</h3>
            <p><strong>Sets ganados:</strong> ${player.setsWon} / <strong>Sets perdidos:</strong> ${player.setsLost} (Diferencia: ${setDifference > 0 ? '+' : ''}${setDifference})</p>
            <p><strong>Juegos ganados:</strong> ${player.gamesWon} / <strong>Juegos perdidos:</strong> ${player.gamesLost} (Diferencia: ${gameDifference > 0 ? '+' : ''}${gameDifference})</p>

            <hr>

            ${getPartnerStatsHTML(player.id_jugador)}
            ${getRivalStatsHTML(player.id_jugador)}
        `;
    };
    
    const getPartnerStatsHTML = (playerId) => {
        const partnerStats = getPartnerStats(playerId);
        const sortedPartnerStats = partnerStats.sort((a, b) => b.pointsPerMatch - a.pointsPerMatch);
        return `
            <h3>Rendimiento con Parejas</h3>
            <div class="table-responsive">
                <table class="performance-table">
                    <thead>
                        <tr>
                            <th>Compañero</th>
                            <th>Puntos/Partido</th>
                            <th>Victorias</th>
                            <th>Derrotas</th>
                            <th>Empates</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedPartnerStats.map(stat => `
                            <tr>
                                <td>${stat.partnerName}</td>
                                <td>${stat.pointsPerMatch.toFixed(2)}</td>
                                <td>${stat.wins}</td>
                                <td>${stat.losses}</td>
                                <td>${stat.ties}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const getRivalStatsHTML = (playerId) => {
        const rivalStats = getRivalStats(playerId);
        const sortedRivalStats = rivalStats.sort((a, b) => a.pointsPerMatch - b.pointsPerMatch);
        return `
            <h3>Rendimiento contra Rivales</h3>
            <div class="table-responsive">
                <table class="performance-table">
                    <thead>
                        <tr>
                            <th>Rival</th>
                            <th>Puntos/Partido</th>
                            <th>Victorias</th>
                            <th>Derrotas</th>
                            <th>Empates</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedRivalStats.map(stat => `
                            <tr>
                                <td>${stat.rivalName}</td>
                                <td>${stat.pointsPerMatch.toFixed(2)}</td>
                                <td>${stat.wins}</td>
                                <td>${stat.losses}</td>
                                <td>${stat.ties}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const populatePlayerSelect = () => {
        playerSelect.innerHTML = '<option value="">Selecciona un jugador</option>' + 
            players.map(p => `<option value="${p.id_jugador}">${p.nombre}</option>`).join('');
    };

    playerSelect.addEventListener('change', (event) => {
        const selectedPlayerId = parseInt(event.target.value);
        if (selectedPlayerId) {
            renderPlayerProfile(selectedPlayerId);
        } else {
            document.getElementById('player-profile-container').innerHTML = '';
        }
    });

    const getPartnerStats = (playerId) => {
        const stats = new Map();
        const playerMatches = matches.filter(match => {
            const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
            if (isSuspended) return false;
            const playerInMatch = match_couples.some(mp => {
                const pair = couples.find(p => p.id_pareja === mp.id_pareja);
                return mp && mp.id_partido === match.id_partido && (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId);
            });
            return playerInMatch;
        });
        
        playerMatches.forEach(match => {
            const playerCouple = couples.find(p => {
                const mp = match_couples.find(mp => mp.id_partido === match.id_partido && mp.id_pareja === p.id_pareja);
                return mp && (p.id_jugador1 === playerId || p.id_jugador2 === playerId);
            });
            if (!playerCouple) return;
            
            const partnerId = playerCouple.id_jugador1 === playerId ? playerCouple.id_jugador2 : playerCouple.id_jugador1;
            
            if (!stats.has(partnerId)) {
                stats.set(partnerId, { wins: 0, losses: 0, ties: 0, totalPoints: 0, matchesPlayed: 0 });
            }
            
            const matchResult = results.find(r => r.id_partido === match.id_partido);
            const playerTeam = match_couples.find(mp => mp.id_partido === match.id_partido && mp.id_pareja === playerCouple.id_pareja)?.equipo;
            
            const currentStats = stats.get(partnerId);
            if (matchResult.equipo_ganador === playerTeam) currentStats.wins++;
            else if (matchResult.equipo_ganador === 0) currentStats.ties++;
            else currentStats.losses++;
            
            currentStats.totalPoints += calculatePlayerPoints(playerId, match.id_partido);
            currentStats.matchesPlayed++;
        });

        return Array.from(stats.keys()).map(id => {
            const partnerName = players.find(p => p.id_jugador === id)?.nombre || 'Jugador Desconocido';
            const s = stats.get(id);
            return {
                partnerName,
                ...s,
                pointsPerMatch: s.matchesPlayed > 0 ? s.totalPoints / s.matchesPlayed : 0
            };
        });
    };

    const getRivalStats = (playerId) => {
        const stats = new Map();
        const playerMatches = matches.filter(match => {
            const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
            if (isSuspended) return false;
            const playerInMatch = match_couples.some(mp => {
                const pair = couples.find(p => p.id_pareja === mp.id_pareja);
                return mp && mp.id_partido === match.id_partido && (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId);
            });
            return playerInMatch;
        });
        
        playerMatches.forEach(match => {
            const playerMatchCouple = match_couples.find(mp => {
                const pair = couples.find(p => p.id_pareja === mp.id_pareja);
                return mp && mp.id_partido === match.id_partido && (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId);
            });
            if (!playerMatchCouple) return;

            const rivalMatchCouples = match_couples.filter(mp => mp.id_partido === match.id_partido && mp.equipo !== playerMatchCouple.equipo);

            rivalMatchCouples.forEach(rmc => {
                const rivalCouple = couples.find(p => p.id_pareja === rmc.id_pareja);
                const rivalPlayers = [rivalCouple.id_jugador1, rivalCouple.id_jugador2];

                rivalPlayers.forEach(rivalId => {
                    if (!stats.has(rivalId)) {
                        stats.set(rivalId, { wins: 0, losses: 0, ties: 0, totalPoints: 0, matchesPlayed: 0 });
                    }
                    
                    const matchResult = results.find(r => r.id_partido === match.id_partido);
                    const currentStats = stats.get(rivalId);
                    
                    if (matchResult.equipo_ganador === playerMatchCouple.equipo) currentStats.wins++;
                    else if (matchResult.equipo_ganador === 0) currentStats.ties++;
                    else currentStats.losses++;

                    currentStats.totalPoints += calculatePlayerPoints(playerId, match.id_partido);
                    currentStats.matchesPlayed++;
                });
            });
        });

        return Array.from(stats.keys()).map(id => {
            const rivalName = players.find(p => p.id_jugador === id)?.nombre || 'Jugador Desconocido';
            const s = stats.get(id);
            return {
                rivalName,
                ...s,
                pointsPerMatch: s.matchesPlayed > 0 ? s.totalPoints / s.matchesPlayed : 0
            };
        });
    };

    const renderMetrics = () => {
        const sortedPlayers = [...playersStats].sort((a, b) => b.totalPoints - a.totalPoints);
        const playerNames = sortedPlayers.map(p => p.nombre);
        const playerPoints = sortedPlayers.map(p => p.totalPoints);
        const backgroundColors = sortedPlayers.map(p => getRandomColor(p.nombre));
        
        const ctxPoints = document.getElementById('pointsChart').getContext('2d');
        if (window.pointsChart instanceof Chart) {
            window.pointsChart.destroy();
        }
        window.pointsChart = new Chart(ctxPoints, {
            type: 'bar',
            data: {
                labels: playerNames,
                datasets: [{
                    label: 'Puntos Totales',
                    data: playerPoints,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });

        const playerNamesForWinLoss = players.map(p => p.nombre);
        const winData = playersStats.map(p => p.wins);
        const lossData = playersStats.map(p => p.losses);
        
        const ctxWinLoss = document.getElementById('winLossChart').getContext('2d');
        if (window.winLossChart instanceof Chart) {
            window.winLossChart.destroy();
        }
        window.winLossChart = new Chart(ctxWinLoss, {
            type: 'bar',
            data: {
                labels: playerNamesForWinLoss,
                datasets: [{
                    label: 'Victorias',
                    data: winData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }, {
                    label: 'Derrotas',
                    data: lossData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });

        renderHabitualPairs();
    };

    const renderHabitualPairs = () => {
        const pairStats = {};

        matches.filter(match => results.find(r => r.id_partido === match.id_partido)?.equipo_ganador !== -1).forEach(match => {
            const matchCouples = match_couples.filter(mc => mc.id_partido === match.id_partido);
            matchCouples.forEach(mc => {
                const couple = couples.find(c => c.id_pareja === mc.id_pareja);
                if (couple) {
                    const pairKey = [couple.id_jugador1, couple.id_jugador2].sort().join('-');
                    if (!pairStats[pairKey]) {
                        pairStats[pairKey] = {
                            id1: couple.id_jugador1,
                            id2: couple.id_jugador2,
                            matchesPlayed: 0,
                            wins: 0,
                            losses: 0,
                            ties: 0
                        };
                    }
                    
                    pairStats[pairKey].matchesPlayed++;
                    const matchResult = results.find(r => r.id_partido === match.id_partido);
                    if (matchResult.equipo_ganador === mc.equipo) {
                        pairStats[pairKey].wins++;
                    } else if (matchResult.equipo_ganador === 0) {
                        pairStats[pairKey].ties++;
                    } else {
                        pairStats[pairKey].losses++;
                    }
                }
            });
        });

        const sortedPairs = Object.values(pairStats).sort((a, b) => b.wins - a.wins);
        const container = document.getElementById('habitual-pairs-table');
        
        const tableContent = sortedPairs.map(pair => {
            const player1Name = players.find(p => p.id_jugador === pair.id1)?.nombre || 'N/A';
            const player2Name = players.find(p => p.id_jugador === pair.id2)?.nombre || 'N/A';
            const percentage = (pair.wins / pair.matchesPlayed * 100).toFixed(1);
            
            return `
                <tr>
                    <td>${player1Name} y ${player2Name}</td>
                    <td>${pair.matchesPlayed}</td>
                    <td>${pair.wins}</td>
                    <td>${pair.losses}</td>
                    <td>${pair.ties}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Pareja</th>
                            <th>Partidos</th>
                            <th>Victorias</th>
                            <th>Derrotas</th>
                            <th>Empates</th>
                            <th>% Ganadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableContent}
                    </tbody>
                </table>
            </div>
        `;
    };

    const renderHistory = () => {
        const container = document.getElementById('history-container');
        const sortedMatches = [...matches].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        const historyContent = sortedMatches.map(match => {
            const matchResult = results.find(r => r.id_partido === match.id_partido);
            const setsPlayed = sets.filter(s => s.id_partido === match.id_partido);
            const matchCouples = match_couples.filter(mp => mp.id_partido === match.id_partido);

            const team1Couple = couples.find(c => matchCouples.find(mc => mc.id_pareja === c.id_pareja && mc.equipo === 1));
            const team2Couple = couples.find(c => matchCouples.find(mc => mc.id_pareja === c.id_pareja && mc.equipo === 2));

            if (!team1Couple || !team2Couple) return '';

            const team1Name = `${players.find(p => p.id_jugador === team1Couple.id_jugador1)?.nombre || 'N/A'} y ${players.find(p => p.id_jugador === team1Couple.id_jugador2)?.nombre || 'N/A'}`;
            const team2Name = `${players.find(p => p.id_jugador === team2Couple.id_jugador1)?.nombre || 'N/A'} y ${players.find(p => p.id_jugador === team2Couple.id_jugador2)?.nombre || 'N/A'}`;

            const setsScore = setsPlayed.map(s => `${s.juegos_equipo1}-${s.juegos_equipo2}`).join(', ');
            
            let resultText = "Partido suspendido";
            if (matchResult && matchResult.equipo_ganador !== -1) {
                if (matchResult.equipo_ganador === 1) {
                    resultText = `Ganadores: ${team1Name}`;
                } else if (matchResult.equipo_ganador === 2) {
                    resultText = `Ganadores: ${team2Name}`;
                } else {
                    resultText = 'Empate';
                }
            }

            return `
                <tr>
                    <td data-label="Fecha">${new Date(match.fecha).toLocaleDateString()}</td>
                    <td data-label="Jugadores">
                        <small>${team1Name}</small><br>
                        <small>${team2Name}</small>
                    </td>
                    <td data-label="Resultado">${setsScore}</td>
                    <td data-label="Ganador">${resultText}</td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Jugadores</th>
                        <th>Resultado</th>
                        <th>Ganador</th>
                    </tr>
                </thead>
                <tbody>
                    ${historyContent}
                </tbody>
            </table>
        `;
    };

    populatePlayerSelect();
    renderRanking();
});