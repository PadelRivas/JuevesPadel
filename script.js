document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE NAVEGACIÓN DE PESTAÑAS ---
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

            // Llamar a la función de renderizado de la pestaña correspondiente
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

    // --- MANEJO DE DATOS Y RENDERIZADO ---
    if (typeof appData === 'undefined') {
        console.error('Los datos del backend no se han cargado (appData no está definido).');
        return;
    }
    
    const players = appData.players;
    const matches = appData.matches;
    const sets = appData.sets;
    const results = appData.results;
    
    // Función para calcular puntos de un jugador en un partido
    const calculatePlayerPoints = (playerId, matchId) => {
        const matchSets = sets.filter(s => s.id_partido === matchId);
        const matchResult = results.find(r => r.id_partido === matchId);
        const matchPairs = appData.match_pareja.filter(mp => mp.id_partido === matchId);
        
        let playerTeam = null;
        for (const mp of matchPairs) {
            const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
            if (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId) {
                playerTeam = mp.equipo;
                break;
            }
        }

        if (!playerTeam) return 0;

        const isWinner = matchResult.equipo_ganador === playerTeam;
        const isTie = matchResult.equipo_ganador === 0;

        if (isWinner) {
            return 20;
        } else if (isTie) {
            let setsWon = 0;
            if (playerTeam === 1) {
                setsWon = matchSets.filter(s => s.juegos_equipo1 > s.juegos_equipo2).length;
            } else {
                setsWon = matchSets.filter(s => s.juegos_equipo2 > s.juegos_equipo1).length;
            }
            return setsWon;
        } else { // Derrota
            let setsWon = 0;
            if (playerTeam === 1) {
                setsWon = matchSets.filter(s => s.juegos_equipo1 > s.juegos_equipo2).length;
            } else {
                setsWon = matchSets.filter(s => s.juegos_equipo2 > s.juegos_equipo1).length;
            }
            return setsWon;
        }
    };

    // Función para obtener los datos de cada jugador
    const getPlayerStats = () => {
        return players.map(player => {
            const playerMatches = matches.filter(match => {
                const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
                if (isSuspended) return false;

                const playerInMatch = appData.match_pareja.some(mp => {
                    if (mp.id_partido === match.id_partido) {
                        const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                        return pair && (pair.id_jugador1 === player.id_jugador || pair.id_jugador2 === player.id_jugador);
                    }
                    return false;
                });
                return playerInMatch;
            });

            let wins = 0;
            let losses = 0;
            let ties = 0;
            let totalPoints = 0;

            playerMatches.forEach(match => {
                const matchResult = results.find(r => r.id_partido === match.id_partido);
                if (!matchResult) return;

                const playerTeam = appData.match_pareja.find(mp => {
                    const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                    return mp.id_partido === match.id_partido && (pair.id_jugador1 === player.id_jugador || pair.id_jugador2 === player.id_jugador);
                })?.equipo;

                if (matchResult.equipo_ganador === playerTeam) {
                    wins++;
                } else if (matchResult.equipo_ganador === 0) {
                    ties++;
                } else {
                    losses++;
                }

                totalPoints += calculatePlayerPoints(player.id_jugador, match.id_partido);
            });

            const pointsPerMatch = playerMatches.length > 0 ? (totalPoints / playerMatches.length).toFixed(2) : 0;
            
            // Lógica para racha de victorias consecutivas
            let currentWinStreak = 0;
            let maxWinStreak = 0;
            const sortedMatches = playerMatches.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            sortedMatches.forEach(match => {
                const matchResult = results.find(r => r.id_partido === match.id_partido);
                const playerTeam = appData.match_pareja.find(mp => {
                    const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                    return mp.id_partido === match.id_partido && (pair.id_jugador1 === player.id_jugador || pair.id_jugador2 === player.id_jugador);
                })?.equipo;

                if (matchResult.equipo_ganador === playerTeam) {
                    currentWinStreak++;
                } else {
                    maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
                    currentWinStreak = 0;
                }
            });
            maxWinStreak = Math.max(maxWinStreak, currentWinStreak);

            return {
                ...player,
                matchesPlayed: playerMatches.length,
                wins,
                losses,
                ties,
                totalPoints,
                pointsPerMatch: parseFloat(pointsPerMatch),
                winStreak: maxWinStreak
            };
        });
    };

    const playersStats = getPlayerStats();

    // --- PESTAÑA CLASIFICACIÓN ---
    const renderRanking = () => {
        const sortedPlayers = [...playersStats].sort((a, b) => b.pointsPerMatch - a.pointsPerMatch);
        const container = document.getElementById('ranking-container');
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
                    ${sortedPlayers.map((player, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${player.nombre}</td>
                            <td>${player.pointsPerMatch}</td>
                            <td>${player.totalPoints}</td>
                            <td>${player.matchesPlayed}</td>
                            <td>${player.wins}</td>
                            <td>${player.ties}</td>
                            <td>${player.losses}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    // --- PESTAÑA JUGADOR (Necesita selección, por ahora muestra el primero) ---
    const renderPlayerProfile = () => {
        // En un entorno real, tendrías un sistema para seleccionar un jugador (ej. URL param)
        // Por ahora, usamos el primer jugador para demo
        const player = playersStats[0];
        if (!player) return;

        document.getElementById('player-name').textContent = player.nombre;
        const container = document.getElementById('player-profile-container');
        
        // Asumiendo que player.sets y player.games existen o se pueden calcular aquí
        let totalSetsWon = 0;
        let totalSetsLost = 0;
        let totalGamesWon = 0;
        let totalGamesLost = 0;
        
        const playerMatches = matches.filter(match => {
            const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
            if (isSuspended) return false;
            const playerInMatch = appData.match_pareja.some(mp => {
                if (mp.id_partido === match.id_partido) {
                    const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                    return pair && (pair.id_jugador1 === player.id_jugador || pair.id_jugador2 === player.id_jugador);
                }
                return false;
            });
            return playerInMatch;
        });

        playerMatches.forEach(match => {
            const matchSets = sets.filter(s => s.id_partido === match.id_partido);
            const playerTeam = appData.match_pareja.find(mp => {
                const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                return mp.id_partido === match.id_partido && (pair.id_jugador1 === player.id_jugador || pair.id_jugador2 === player.id_jugador);
            })?.equipo;
            
            if(playerTeam === 1){
                 matchSets.forEach(s => {
                    if(s.juegos_equipo1 > s.juegos_equipo2) totalSetsWon++; else totalSetsLost++;
                    totalGamesWon += s.juegos_equipo1;
                    totalGamesLost += s.juegos_equipo2;
                 });
            } else if (playerTeam === 2){
                matchSets.forEach(s => {
                    if(s.juegos_equipo2 > s.juegos_equipo1) totalSetsWon++; else totalSetsLost++;
                    totalGamesWon += s.juegos_equipo2;
                    totalGamesLost += s.juegos_equipo1;
                 });
            }
        });

        container.innerHTML = `
            <h3>Resumen de Rendimiento</h3>
            <p><strong>Puntos totales:</strong> ${player.totalPoints}</p>
            <p><strong>Puntos por partido:</strong> ${player.pointsPerMatch}</p>
            <p><strong>Partidos jugados:</strong> ${player.matchesPlayed}</p>
            <p><strong>Récord de Victorias Consecutivas:</strong> ${player.winStreak}</p>

            <h3>Rendimiento con Parejas</h3>
            <div id="partner-stats-table"></div>

            <h3>Rendimiento contra Rivales</h3>
            <div id="rival-stats-table"></div>

            <h3>Detalle de Sets y Juegos</h3>
            <p><strong>Sets ganados:</strong> ${totalSetsWon} / <strong>Sets perdidos:</strong> ${totalSetsLost}</p>
            <p><strong>Juegos ganados:</strong> ${totalGamesWon} / <strong>Juegos perdidos:</strong> ${totalGamesLost}</p>
        `;

        // Renderizado de Rendimiento con Parejas
        const partnerStats = getPartnerStats(player.id_jugador);
        const partnerTable = document.getElementById('partner-stats-table');
        partnerTable.innerHTML = `
            <table>
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
                    ${partnerStats.sort((a, b) => b.pointsPerMatch - a.pointsPerMatch).map(stat => `
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
        `;

        // Renderizado de Rendimiento contra Rivales (ordenado de forma inversa)
        const rivalStats = getRivalStats(player.id_jugador);
        const rivalTable = document.getElementById('rival-stats-table');
        rivalTable.innerHTML = `
            <table>
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
                    ${rivalStats.sort((a, b) => a.pointsPerMatch - b.pointsPerMatch).map(stat => `
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
        `;
    };
    
    const getPartnerStats = (playerId) => {
        const stats = {};
        
        const playerMatches = matches.filter(match => {
            const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
            if (isSuspended) return false;
            const playerInMatch = appData.match_pareja.some(mp => {
                const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                return mp.id_partido === match.id_partido && (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId);
            });
            return playerInMatch;
        });
        
        playerMatches.forEach(match => {
            const playerPair = appData.parejas.find(p => {
                const mp = appData.match_pareja.find(mp => mp.id_partido === match.id_partido && mp.id_pareja === p.id_pareja);
                return mp && (p.id_jugador1 === playerId || p.id_jugador2 === playerId);
            });
            if (!playerPair) return;
            
            const partnerId = playerPair.id_jugador1 === playerId ? playerPair.id_jugador2 : playerPair.id_jugador1;
            
            if (!stats[partnerId]) {
                stats[partnerId] = { wins: 0, losses: 0, ties: 0, totalPoints: 0, matchesPlayed: 0 };
            }
            
            const matchResult = results.find(r => r.id_partido === match.id_partido);
            const playerTeam = appData.match_pareja.find(mp => mp.id_partido === match.id_partido && mp.id_pareja === playerPair.id_pareja)?.equipo;
            
            if(matchResult.equipo_ganador === playerTeam) stats[partnerId].wins++;
            else if(matchResult.equipo_ganador === 0) stats[partnerId].ties++;
            else stats[partnerId].losses++;
            
            stats[partnerId].totalPoints += calculatePlayerPoints(playerId, match.id_partido);
            stats[partnerId].matchesPlayed++;
        });

        return Object.keys(stats).map(id => {
            const partnerName = players.find(p => p.id_jugador == id).nombre;
            return {
                partnerName,
                wins: stats[id].wins,
                losses: stats[id].losses,
                ties: stats[id].ties,
                pointsPerMatch: stats[id].matchesPlayed > 0 ? stats[id].totalPoints / stats[id].matchesPlayed : 0
            };
        });
    };

    const getRivalStats = (playerId) => {
        const stats = {};
        const playerMatches = matches.filter(match => {
            const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
            if (isSuspended) return false;
            const playerInMatch = appData.match_pareja.some(mp => {
                const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                return mp.id_partido === match.id_partido && (pair.id_jugador1 === playerId || pair.id_jugador2 === playerId);
            });
            return playerInMatch;
        });

        playerMatches.forEach(match => {
            const playerPair = appData.parejas.find(p => {
                const mp = appData.match_pareja.find(mp => mp.id_partido === match.id_partido && mp.id_pareja === p.id_pareja);
                return mp && (p.id_jugador1 === playerId || p.id_jugador2 === playerId);
            });
            
            const playerTeam = appData.match_pareja.find(mp => mp.id_partido === match.id_partido && mp.id_pareja === playerPair.id_pareja)?.equipo;
            const rivalTeam = playerTeam === 1 ? 2 : 1;
            
            const rivalPairData = appData.match_pareja.find(mp => mp.id_partido === match.id_partido && mp.equipo === rivalTeam);
            const rivalPair = appData.parejas.find(p => p.id_pareja === rivalPairData.id_pareja);
            const rivalPlayer1Id = rivalPair.id_jugador1;
            const rivalPlayer2Id = rivalPair.id_jugador2;
            
            [rivalPlayer1Id, rivalPlayer2Id].forEach(rivalId => {
                if (!stats[rivalId]) {
                    stats[rivalId] = { wins: 0, losses: 0, ties: 0, totalPoints: 0, matchesPlayed: 0 };
                }

                const matchResult = results.find(r => r.id_partido === match.id_partido);
                if(matchResult.equipo_ganador === playerTeam) stats[rivalId].wins++;
                else if(matchResult.equipo_ganador === 0) stats[rivalId].ties++;
                else stats[rivalId].losses++;
                
                stats[rivalId].totalPoints += calculatePlayerPoints(playerId, match.id_partido);
                stats[rivalId].matchesPlayed++;
            });
        });

        return Object.keys(stats).map(id => {
            const rivalName = players.find(p => p.id_jugador == id).nombre;
            return {
                rivalName,
                wins: stats[id].wins,
                losses: stats[id].losses,
                ties: stats[id].ties,
                pointsPerMatch: stats[id].matchesPlayed > 0 ? stats[id].totalPoints / stats[id].matchesPlayed : 0
            };
        });
    };

    // --- PESTAÑA MÉTRICAS ---
    const renderMetrics = () => {
        const container = document.getElementById('metrics-container');
        container.innerHTML = '';
        
        // Rendimiento en Sets y Juegos
        const allPlayedMatches = matches.filter(match => {
            const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
            return !isSuspended;
        });

        let totalSets = 0;
        let totalGames = 0;
        allPlayedMatches.forEach(match => {
            const matchSets = sets.filter(s => s.id_partido === match.id_partido);
            totalSets += matchSets.length;
            matchSets.forEach(s => totalGames += (s.juegos_equipo1 + s.juegos_equipo2));
        });

        const avgSetsPerMatch = allPlayedMatches.length > 0 ? (totalSets / allPlayedMatches.length).toFixed(2) : 0;
        const avgGamesPerSet = totalSets > 0 ? (totalGames / totalSets).toFixed(2) : 0;

        // Curiosidades y Récords
        const allSets = sets.filter(s => {
            const isSuspended = results.find(r => r.id_partido === s.id_partido)?.equipo_ganador === -1;
            return !isSuspended;
        });
        
        let maxGameDiffSet = { diff: 0, matchId: null };
        allSets.forEach(s => {
            const diff = Math.abs(s.juegos_equipo1 - s.juegos_equipo2);
            if (diff > maxGameDiffSet.diff) {
                maxGameDiffSet = { diff, matchId: s.id_partido, setNum: s.numero_set };
            }
        });

        const playerWithMostMatches = playersStats.sort((a, b) => b.matchesPlayed - a.matchesPlayed)[0];

        let pairsPlayedCount = {};
        appData.match_pareja.forEach(mp => {
            const isSuspended = results.find(r => r.id_partido === mp.id_partido)?.equipo_ganador === -1;
            if (isSuspended) return;
            
            const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
            const pairKey = [pair.id_jugador1, pair.id_jugador2].sort().join('-');
            pairsPlayedCount[pairKey] = (pairsPlayedCount[pairKey] || 0) + 1;
        });

        const mostPlayedPairKey = Object.keys(pairsPlayedCount).sort((a, b) => pairsPlayedCount[b] - pairsPlayedCount[a])[0];
        const mostPlayedPairIds = mostPlayedPairKey ? mostPlayedPairKey.split('-') : [null, null];
        const mostPlayedPairNames = mostPlayedPairIds.map(id => players.find(p => p.id_jugador == id)?.nombre).join(' y ');

        const allWinStreaks = playersStats.map(p => p.winStreak);
        const maxWinStreak = Math.max(...allWinStreaks);

        const allLossStreaks = playersStats.map(p => {
            let currentLossStreak = 0;
            let maxLossStreak = 0;
            const playerMatches = matches.filter(match => {
                const isSuspended = results.find(r => r.id_partido === match.id_partido)?.equipo_ganador === -1;
                if (isSuspended) return false;
                const playerInMatch = appData.match_pareja.some(mp => {
                    const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                    return mp.id_partido === match.id_partido && (pair.id_jugador1 === p.id_jugador || pair.id_jugador2 === p.id_jugador);
                });
                return playerInMatch;
            });
            const sortedMatches = playerMatches.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

            sortedMatches.forEach(match => {
                const matchResult = results.find(r => r.id_partido === match.id_partido);
                const playerTeam = appData.match_pareja.find(mp => {
                    const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                    return mp.id_partido === match.id_partido && (pair.id_jugador1 === p.id_jugador || pair.id_jugador2 === p.id_jugador);
                })?.equipo;
                
                if (matchResult.equipo_ganador !== playerTeam && matchResult.equipo_ganador !== 0) {
                    currentLossStreak++;
                } else {
                    maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
                    currentLossStreak = 0;
                }
            });
            return Math.max(maxLossStreak, currentLossStreak);
        });
        const maxLossStreak = Math.max(...allLossStreaks);
        
        // Parejas habituales e inéditas
        const mostPlayedPairs = Object.entries(pairsPlayedCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([key, count]) => {
                const [id1, id2] = key.split('-');
                return {
                    name1: players.find(p => p.id_jugador == id1)?.nombre,
                    name2: players.find(p => p.id_jugador == id2)?.nombre,
                    count
                };
            });

        const newPairs = mostPlayedPairs.filter(p => p.count === 1);

        const playedPairsKeys = new Set(Object.keys(pairsPlayedCount));
        const allPossiblePairs = [];
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const key = [players[i].id_jugador, players[j].id_jugador].sort().join('-');
                if (!playedPairsKeys.has(key)) {
                    allPossiblePairs.push({ name1: players[i].nombre, name2: players[j].nombre });
                }
            }
        }

        container.innerHTML = `
            <h3>Rendimiento en Sets y Juegos</h3>
            <p><strong>Promedio de sets por partido:</strong> ${avgSetsPerMatch}</p>
            <p><strong>Promedio de juegos por set:</strong> ${avgGamesPerSet}</p>

            <h3>Curiosidades y Récords</h3>
            <ul>
                <li><strong>Mayor diferencia de juegos en un set:</strong> ${maxGameDiffSet.diff} juegos</li>
                <li><strong>Jugador con más partidos jugados:</strong> ${playerWithMostMatches ? playerWithMostMatches.nombre : 'N/A'} (${playerWithMostMatches ? playerWithMostMatches.matchesPlayed : 0} partidos)</li>
                <li><strong>Pareja con más partidos jugados:</strong> ${mostPlayedPairNames ? mostPlayedPairNames : 'N/A'} (${pairsPlayedCount[mostPlayedPairKey] || 0} partidos)</li>
                <li><strong>Racha de victorias más larga:</strong> ${maxWinStreak} partidos</li>
                <li><strong>Racha de derrotas más larga:</strong> ${maxLossStreak} partidos</li>
            </ul>

            <h3>Parejas Habituales</h3>
            <div id="habitual-pairs-table">
                <table>
                    <thead>
                        <tr>
                            <th>Pareja</th>
                            <th>Partidos Jugados</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mostPlayedPairs.map(p => `
                            <tr>
                                <td>${p.name1} y ${p.name2}</td>
                                <td>${p.count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <h3>Parejas Inéditas</h3>
            <h4>Parejas nuevas (1 partido)</h4>
            <div id="new-pairs-list">
                <ul>
                    ${newPairs.map(p => `<li>${p.name1} y ${p.name2}</li>`).join('')}
                </ul>
            </div>
            <h4>Parejas por estrenar</h4>
            <div id="unplayed-pairs-list">
                <ul>
                    ${allPossiblePairs.map(p => `<li>${p.name1} y ${p.name2}</li>`).join('')}
                </ul>
            </div>
        `;
    };

    // --- PESTAÑA HISTORIAL DE PARTIDOS ---
    const monthFilter = document.getElementById('month-filter');
    const playerFilter = document.getElementById('player-filter');
    const resultFilter = document.getElementById('result-filter');
    const historyContainer = document.getElementById('history-container');

    const renderHistory = () => {
        // Llenar el filtro de jugadores
        playerFilter.innerHTML = '<option value="">Todos los jugadores</option>' + players.map(p => `<option value="${p.id_jugador}">${p.nombre}</option>`).join('');

        const filteredMatches = matches.filter(match => {
            const matchDate = new Date(match.fecha);
            const matchMonth = matchDate.getMonth() + 1;
            const selectedMonth = monthFilter.value;

            const selectedPlayerId = parseInt(playerFilter.value);
            const selectedResult = resultFilter.value;

            const matchResult = results.find(r => r.id_partido === match.id_partido);
            const isSuspended = matchResult?.equipo_ganador === -1;
            if (isSuspended) return false;

            // Filtro por mes
            if (selectedMonth && matchMonth != selectedMonth) return false;

            // Filtro por jugador
            if (selectedPlayerId) {
                const playerInMatch = appData.match_pareja.some(mp => {
                    if (mp.id_partido === match.id_partido) {
                        const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                        return pair && (pair.id_jugador1 === selectedPlayerId || pair.id_jugador2 === selectedPlayerId);
                    }
                    return false;
                });
                if (!playerInMatch) return false;
            }

            // Filtro por resultado
            if (selectedResult) {
                const matchResults = results.find(r => r.id_partido === match.id_partido);
                if (!matchResults) return false;

                const selectedPlayerTeam = appData.match_pareja.find(mp => {
                    const pair = appData.parejas.find(p => p.id_pareja === mp.id_pareja);
                    return mp.id_partido === match.id_partido && (pair.id_jugador1 === selectedPlayerId || pair.id_jugador2 === selectedPlayerId);
                })?.equipo;

                if (selectedResult === 'won' && matchResults.equipo_ganador !== selectedPlayerTeam) return false;
                if (selectedResult === 'lost' && matchResults.equipo_ganador === selectedPlayerTeam) return false;
                if (selectedResult === 'tied' && matchResults.equipo_ganador !== 0) return false;
            }

            return true;
        });

        // Generar el HTML de la tabla
        const tableContent = filteredMatches.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(match => {
            const matchPairs = appData.match_pareja.filter(mp => mp.id_partido === match.id_partido);
            const pair1 = appData.parejas.find(p => p.id_pareja === matchPairs.find(mp => mp.equipo === 1).id_pareja);
            const pair2 = appData.parejas.find(p => p.id_pareja === matchPairs.find(mp => mp.equipo === 2).id_pareja);
            
            const player1Pair1 = players.find(p => p.id_jugador === pair1.id_jugador1).nombre;
            const player2Pair1 = players.find(p => p.id_jugador === pair1.id_jugador2).nombre;
            const player1Pair2 = players.find(p => p.id_jugador === pair2.id_jugador1).nombre;
            const player2Pair2 = players.find(p => p.id_jugador === pair2.id_jugador2).nombre;

            const matchSets = sets.filter(s => s.id_partido === match.id_partido);
            const result = matchSets.map(s => `${s.juegos_equipo1}-${s.juegos_equipo2}`).join(', ');

            const matchResult = results.find(r => r.id_partido === match.id_partido);
            let winnerText = 'Empate';
            if (matchResult.equipo_ganador === 1) winnerText = 'Equipo 1';
            if (matchResult.equipo_ganador === 2) winnerText = 'Equipo 2';

            return `
                <tr>
                    <td>${match.fecha}</td>
                    <td>${player1Pair1} y ${player2Pair1} vs ${player1Pair2} y ${player2Pair2}</td>
                    <td>${result}</td>
                    <td>${winnerText}</td>
                    <td>N/A (Cálculo en JS)</td>
                </tr>
            `;
        }).join('');

        historyContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Equipos</th>
                        <th>Resultado Final</th>
                        <th>Resultado del Partido</th>
                        <th>Puntos del Partido</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        `;
    };

    // Event listeners para los filtros
    monthFilter.addEventListener('change', renderHistory);
    playerFilter.addEventListener('change', renderHistory);
    resultFilter.addEventListener('change', renderHistory);
    
    // Iniciar la aplicación mostrando la primera pestaña
    renderRanking();
});