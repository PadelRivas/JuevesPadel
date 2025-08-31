const appData = {
    "jugadores": [
        {
            "id_jugador": 1,
            "nombre": "Adrian"
        },
        {
            "id_jugador": 2,
            "nombre": "Sergio"
        },
        {
            "id_jugador": 3,
            "nombre": "David"
        },
        {
            "id_jugador": 4,
            "nombre": "Javi"
        },
        {
            "id_jugador": 5,
            "nombre": "Pablo"
        },
        {
            "id_jugador": 6,
            "nombre": "Carlos"
        }
    ],
    "partidos": [
        {
            "id_partido": 1,
            "fecha": "2025-09-01"
        },
        {
            "id_partido": 2,
            "fecha": "2025-09-08"
        },
        {
            "id_partido": 3,
            "fecha": "2025-09-15"
        },
        {
            "id_partido": 4,
            "fecha": "2025-09-22"
        }
    ],
    "parejas": [
        {
            "id_pareja": 1,
            "id_jugador1": 1,
            "id_jugador2": 2
        },
        {
            "id_pareja": 2,
            "id_jugador1": 3,
            "id_jugador2": 4
        },
        {
            "id_pareja": 3,
            "id_jugador1": 5,
            "id_jugador2": 6
        },
        {
            "id_pareja": 4,
            "id_jugador1": 1,
            "id_jugador2": 3
        },
        {
            "id_pareja": 5,
            "id_jugador1": 2,
            "id_jugador2": 5
        },
        {
            "id_pareja": 6,
            "id_jugador1": 4,
            "id_jugador2": 6
        },
        {
            "id_pareja": 7,
            "id_jugador1": 1,
            "id_jugador2": 4
        },
        {
            "id_pareja": 8,
            "id_jugador1": 2,
            "id_jugador2": 3
        },
        {
            "id_pareja": 9,
            "id_jugador1": 5,
            "id_jugador2": 6
        }
    ],
    "resultados": [
        // Partido 1: Adrian y Sergio ganan a David y Javi
        {
            "id_resultado": 1,
            "id_partido": 1,
            "equipo_ganador": 1
        },
        // Partido 2: Adrian y David ganan a Sergio y Pablo
        {
            "id_resultado": 2,
            "id_partido": 2,
            "equipo_ganador": 4
        },
        // Partido 3: Javi y Carlos ganan a Adrian y Javi
        {
            "id_resultado": 3,
            "id_partido": 3,
            "equipo_ganador": 6
        },
        // Partido 4: Se produce un empate. Los 4 jugadores de este partido tendrán los mismos puntos
        {
            "id_resultado": 4,
            "id_partido": 4,
            "equipo_ganador": -1
        }
    ],
    "sets": [
        // Sets del Partido 1
        {
            "id_set": 1,
            "id_partido": 1,
            "numero_set": 1,
            "juegos_equipo1": 6,
            "juegos_equipo2": 4
        },
        {
            "id_set": 2,
            "id_partido": 1,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 3
        },
        // Sets del Partido 2
        {
            "id_set": 3,
            "id_partido": 2,
            "numero_set": 1,
            "juegos_equipo1": 6,
            "juegos_equipo2": 2
        },
        {
            "id_set": 4,
            "id_partido": 2,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 4
        },
        // Sets del Partido 3
        {
            "id_set": 5,
            "id_partido": 3,
            "numero_set": 1,
            "juegos_equipo1": 4,
            "juegos_equipo2": 6
        },
        {
            "id_set": 6,
            "id_partido": 3,
            "numero_set": 2,
            "juegos_equipo1": 2,
            "juegos_equipo2": 6
        },
        // Sets del Partido 4
        {
            "id_set": 7,
            "id_partido": 4,
            "numero_set": 1,
            "juegos_equipo1": 6,
            "juegos_equipo2": 4
        },
        {
            "id_set": 8,
            "id_partido": 4,
            "numero_set": 2,
            "juegos_equipo1": 4,
            "juegos_equipo2": 6
        },
        {
            "id_set": 9,
            "id_partido": 4,
            "numero_set": 3,
            "juegos_equipo1": 7,
            "juegos_equipo2": 6
        },
        {
            "id_set": 10,
            "id_partido": 4,
            "numero_set": 4,
            "juegos_equipo1": 6,
            "juegos_equipo2": 7
        },
        {
            "id_set": 11,
            "id_partido": 4,
            "numero_set": 5,
            "juegos_equipo1": 6,
            "juegos_equipo2": 6
        }
    ],
    "partido_pareja": [
        // Partido 1
        {
            "id_partido": 1,
            "id_pareja": 1,
            "equipo": 1
        },
        {
            "id_partido": 1,
            "id_pareja": 2,
            "equipo": 2
        },
        // Partido 2
        {
            "id_partido": 2,
            "id_pareja": 4,
            "equipo": 1
        },
        {
            "id_partido": 2,
            "id_pareja": 5,
            "equipo": 2
        },
        // Partido 3
        {
            "id_partido": 3,
            "id_pareja": 7,
            "equipo": 1
        },
        {
            "id_partido": 3,
            "id_pareja": 6,
            "equipo": 2
        },
        // Partido 4
        {
            "id_partido": 4,
            "id_pareja": 8,
            "equipo": 1
        },
        {
            "id_partido": 4,
            "id_pareja": 9,
            "equipo": 2
        }
    ]
};