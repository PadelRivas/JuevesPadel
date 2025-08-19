const appData = {
    // Lista de jugadores
    jugadores: [
        { id_jugador: 1, nombre: "Manuel" },
        { id_jugador: 2, nombre: "Miguel" },
        { id_jugador: 3, nombre: "Pedro" },
        { id_jugador: 4, nombre: "Laura" },
        { id_jugador: 5, nombre: "Ana" },
        { id_jugador: 6, nombre: "Carlos" }
    ],
    
    // Partidos jugados
    partidos: [
        { id_partido: 1, fecha: "2024-03-01" },
        { id_partido: 2, fecha: "2024-03-05" },
        { id_partido: 3, fecha: "2024-04-10" },
        { id_partido: 4, fecha: "2024-04-15" },
        { id_partido: 5, fecha: "2024-05-20" },
        { id_partido: 6, fecha: "2024-06-03" },
        { id_partido: 7, fecha: "2024-06-08" },
        { id_partido: 8, fecha: "2024-07-12" },
        { id_partido: 9, fecha: "2024-07-18" },
        { id_partido: 10, fecha: "2024-08-01" },
        { id_partido: 11, fecha: "2024-08-05" }
    ],
    
    // Conjuntos de datos de sets para cada partido
    sets: [
        // Partido 1 (Manuel y Miguel vs Pedro y Laura)
        { id_set: 1, id_partido: 1, juegos_equipo1: 6, juegos_equipo2: 4 },
        { id_set: 2, id_partido: 1, juegos_equipo1: 6, juegos_equipo2: 2 },
        // Partido 2 (Ana y Carlos vs Manuel y Miguel)
        { id_set: 3, id_partido: 2, juegos_equipo1: 6, juegos_equipo2: 3 },
        { id_set: 4, id_partido: 2, juegos_equipo1: 4, juegos_equipo2: 6 },
        { id_set: 5, id_partido: 2, juegos_equipo1: 6, juegos_equipo2: 4 },
        // Partido 3 (Pedro y Ana vs Laura y Carlos)
        { id_set: 6, id_partido: 3, juegos_equipo1: 6, juegos_equipo2: 6 },
        { id_set: 7, id_partido: 3, juegos_equipo1: 6, juegos_equipo2: 6 },
        // Partido 4 (Manuel y Laura vs Miguel y Carlos)
        { id_set: 8, id_partido: 4, juegos_equipo1: 7, juegos_equipo2: 5 },
        { id_set: 9, id_partido: 4, juegos_equipo1: 6, juegos_equipo2: 4 },
        // Partido 5 (Manuel y Ana vs Miguel y Pedro)
        { id_set: 10, id_partido: 5, juegos_equipo1: 4, juegos_equipo2: 6 },
        { id_set: 11, id_partido: 5, juegos_equipo1: 6, juegos_equipo2: 2 },
        { id_set: 12, id_partido: 5, juegos_equipo1: 6, juegos_equipo2: 4 },
        // Partido 6 (Laura y Carlos vs Ana y Pedro)
        { id_set: 13, id_partido: 6, juegos_equipo1: 6, juegos_equipo2: 6 },
        { id_set: 14, id_partido: 6, juegos_equipo1: 6, juegos_equipo2: 6 },
        // Partido 7 (Manuel y Pedro vs Laura y Ana)
        { id_set: 15, id_partido: 7, juegos_equipo1: 6, juegos_equipo2: 3 },
        { id_set: 16, id_partido: 7, juegos_equipo1: 6, juegos_equipo2: 1 },
        // Partido 8 (Miguel y Carlos vs Manuel y Laura)
        { id_set: 17, id_partido: 8, juegos_equipo1: 6, juegos_equipo2: 4 },
        { id_set: 18, id_partido: 8, juegos_equipo1: 6, juegos_equipo2: 6 },
        { id_set: 19, id_partido: 8, juegos_equipo1: 6, juegos_equipo2: 2 },
        // Partido 9 (Pedro y Laura vs Miguel y Ana)
        { id_set: 20, id_partido: 9, juegos_equipo1: 6, juegos_equipo2: 2 },
        { id_set: 21, id_partido: 9, juegos_equipo1: 6, juegos_equipo2: 4 },
        // Partido 10 (Manuel y Ana vs Carlos y Miguel)
        { id_set: 22, id_partido: 10, juegos_equipo1: 6, juegos_equipo2: 2 },
        { id_set: 23, id_partido: 10, juegos_equipo1: 6, juegos_equipo2: 2 },
        // Partido 11 (Pedro y Carlos vs Ana y Laura)
        { id_set: 24, id_partido: 11, juegos_equipo1: 6, juegos_equipo2: 2 },
        { id_set: 25, id_partido: 11, juegos_equipo1: 6, juegos_equipo2: 4 }
    ],
    
    // Resultado del partido (1 = Equipo 1 gana, 2 = Equipo 2 gana, 0 = Empate, -1 = Suspendido)
    resultados: [
        { id_resultado: 1, id_partido: 1, equipo_ganador: 1 },
        { id_resultado: 2, id_partido: 2, equipo_ganador: 2 },
        { id_resultado: 3, id_partido: 3, equipo_ganador: 0 },
        { id_resultado: 4, id_partido: 4, equipo_ganador: 1 },
        { id_resultado: 5, id_partido: 5, equipo_ganador: 1 },
        { id_resultado: 6, id_partido: 6, equipo_ganador: 0 },
        { id_resultado: 7, id_partido: 7, equipo_ganador: 1 },
        { id_resultado: 8, id_partido: 8, equipo_ganador: 1 },
        { id_resultado: 9, id_partido: 9, equipo_ganador: 1 },
        { id_resultado: 10, id_partido: 10, equipo_ganador: 1 },
        { id_resultado: 11, id_partido: 11, equipo_ganador: 1 }
    ],
    
    // Parejas creadas
    parejas: [
        { id_pareja: 1, id_jugador1: 1, id_jugador2: 2 },   // Manuel y Miguel
        { id_pareja: 2, id_jugador1: 3, id_jugador2: 4 },   // Pedro y Laura
        { id_pareja: 3, id_jugador1: 5, id_jugador2: 6 },   // Ana y Carlos
        { id_pareja: 4, id_jugador1: 1, id_jugador2: 5 },   // Manuel y Ana
        { id_pareja: 5, id_jugador1: 2, id_jugador2: 3 },   // Miguel y Pedro
        { id_pareja: 6, id_jugador1: 4, id_jugador2: 6 },   // Laura y Carlos
        { id_pareja: 7, id_jugador1: 1, id_jugador2: 4 },   // Manuel y Laura
        { id_pareja: 8, id_jugador1: 2, id_jugador2: 6 },   // Miguel y Carlos
        { id_pareja: 9, id_jugador1: 3, id_jugador2: 5 }    // Pedro y Ana
    ],

    // Asignación de parejas a partidos y equipos
    partido_pareja: [
        { id_partido_pareja: 1, id_partido: 1, id_pareja: 1, equipo: 1 },
        { id_partido_pareja: 2, id_partido: 1, id_pareja: 2, equipo: 2 },
        { id_partido_pareja: 3, id_partido: 2, id_pareja: 3, equipo: 1 },
        { id_partido_pareja: 4, id_partido: 2, id_pareja: 1, equipo: 2 },
        { id_partido_pareja: 5, id_partido: 3, id_pareja: 5, equipo: 1 },
        { id_partido_pareja: 6, id_partido: 3, id_pareja: 6, equipo: 2 },
        { id_partido_pareja: 7, id_partido: 4, id_pareja: 7, equipo: 1 },
        { id_partido_pareja: 8, id_partido: 4, id_pareja: 8, equipo: 2 },
        { id_partido_pareja: 9, id_partido: 5, id_pareja: 4, equipo: 1 },
        { id_partido_pareja: 10, id_partido: 5, id_pareja: 5, equipo: 2 },
        { id_partido_pareja: 11, id_partido: 6, id_pareja: 6, equipo: 1 },
        { id_partido_pareja: 12, id_partido: 6, id_pareja: 9, equipo: 2 },
        { id_partido_pareja: 13, id_partido: 7, id_pareja: 5, equipo: 1 },
        { id_partido_pareja: 14, id_partido: 7, id_pareja: 4, equipo: 2 },
        { id_partido_pareja: 15, id_partido: 8, id_pareja: 8, equipo: 1 },
        { id_partido_pareja: 16, id_partido: 8, id_pareja: 7, equipo: 2 },
        { id_partido_pareja: 17, id_partido: 9, id_pareja: 2, equipo: 1 },
        { id_partido_pareja: 18, id_partido: 9, id_pareja: 9, equipo: 2 },
        { id_partido_pareja: 19, id_partido: 10, id_pareja: 4, equipo: 1 },
        { id_partido_pareja: 20, id_partido: 10, id_pareja: 8, equipo: 2 },
        { id_partido_pareja: 21, id_partido: 11, id_pareja: 9, equipo: 1 },
        { id_partido_pareja: 22, id_partido: 11, id_pareja: 6, equipo: 2 }
    ]
};