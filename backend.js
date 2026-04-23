const appData = {
"jugadores": [
        {
            "id_jugador": 1,
            "nombre": "DAVID"
        },
        {
            "id_jugador": 2,
            "nombre": "MELERO"
        },
        {
            "id_jugador": 3,
            "nombre": "JESUS"
        },
        {
            "id_jugador": 4,
            "nombre": "NACHO"
        },
        {
            "id_jugador": 5,
            "nombre": "CHAMPI"
        },
        {
            "id_jugador": 6,
            "nombre": "JAVI"
        },
        {
            "id_jugador": 7,
            "nombre": "GONZALO"
        },
        {
            "id_jugador": 8,
            "nombre": "OSCAR"
        },
        {
            "id_jugador": 9,
            "nombre": "TONI"
        },
        {
            "id_jugador": 10,
            "nombre": "ALMUZARA"
        },
        {
            "id_jugador": 11,
            "nombre": "NAVAJAS"
        }
    ],
    "partidos": [
        {
            "id_partido": 1,
            "fecha": "2026-04-09"
        },
        {
            "id_partido": 2,
            "fecha": "2026-04-09"
        },
        {
            "id_partido": 3,
            "fecha": "2026-04-16"
        },
        {
            "id_partido": 4,
            "fecha": "2026-04-23"
        },
        {
            "id_partido": 5,
            "fecha": "2026-04-23"
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
            "id_jugador1": 7,
            "id_jugador2": 8
        },
        {
            "id_pareja": 5,
            "id_jugador1": 5,
            "id_jugador2": 9
        },
        {
            "id_pareja": 6,
            "id_jugador1": 3,
            "id_jugador2": 6
        },
        {
            "id_pareja": 7,
            "id_jugador1": 3,
            "id_jugador2": 10
        },
        {
            "id_pareja": 8,
            "id_jugador1": 4,
            "id_jugador2": 8
        },
        {
            "id_pareja": 9,
            "id_jugador1": 1,
            "id_jugador2": 11
        },
        {
            "id_pareja": 10,
            "id_jugador1": 2,
            "id_jugador2": 6
        }
    ],
    "resultados": [
        {
            "id_resultado": 1,
            "id_partido": 1,
            "equipo_ganador": 1
        },
        {
            "id_resultado": 2,
            "id_partido": 2,
            "equipo_ganador": 1
        },
        {
            "id_resultado": 3,
            "id_partido": 3,
            "equipo_ganador": 2
        },
        {
            "id_resultado": 4,
            "id_partido": 4,
            "equipo_ganador": 2
        },
        {
            "id_resultado": 5,
            "id_partido": 5,
            "equipo_ganador": 1
        }
    ],
    "sets": [
        {
            "id_set": 1,
            "id_partido": 1,
            "numero_set": 1,
            "juegos_equipo1": 4,
            "juegos_equipo2": 6
        },
        {
            "id_set": 2,
            "id_partido": 1,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 2
        },
        {
            "id_set": 3,
            "id_partido": 1,
            "numero_set": 3,
            "juegos_equipo1": 7,
            "juegos_equipo2": 5
        },
        {
            "id_set": 4,
            "id_partido": 2,
            "numero_set": 1,
            "juegos_equipo1": 6,
            "juegos_equipo2": 2
        },
        {
            "id_set": 5,
            "id_partido": 2,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 2
        },
        {
            "id_set": 6,
            "id_partido": 3,
            "numero_set": 1,
            "juegos_equipo1": 2,
            "juegos_equipo2": 6
        },
        {
            "id_set": 7,
            "id_partido": 3,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 7
        },
        {
            "id_set": 8,
            "id_partido": 4,
            "numero_set": 1,
            "juegos_equipo1": 3,
            "juegos_equipo2": 6
        },
        {
            "id_set": 9,
            "id_partido": 4,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 1
        },
        {
            "id_set": 10,
            "id_partido": 4,
            "numero_set": 3,
            "juegos_equipo1": 6,
            "juegos_equipo2": 7
        },
        {
            "id_set": 11,
            "id_partido": 5,
            "numero_set": 1,
            "juegos_equipo1": 6,
            "juegos_equipo2": 3
        },
        {
            "id_set": 12,
            "id_partido": 5,
            "numero_set": 2,
            "juegos_equipo1": 6,
            "juegos_equipo2": 3
        }
    ],
    "partido_pareja": [
        {
            "id_partido_pareja": 1,
            "id_partido": 1,
            "id_pareja": 1,
            "equipo": 1
        },
        {
            "id_partido_pareja": 2,
            "id_partido": 1,
            "id_pareja": 2,
            "equipo": 2
        },
        {
            "id_partido_pareja": 3,
            "id_partido": 2,
            "id_pareja": 3,
            "equipo": 1
        },
        {
            "id_partido_pareja": 4,
            "id_partido": 2,
            "id_pareja": 4,
            "equipo": 2
        },
        {
            "id_partido_pareja": 5,
            "id_partido": 3,
            "id_pareja": 5,
            "equipo": 1
        },
        {
            "id_partido_pareja": 6,
            "id_partido": 3,
            "id_pareja": 6,
            "equipo": 2
        },
        {
            "id_partido_pareja": 7,
            "id_partido": 4,
            "id_pareja": 7,
            "equipo": 1
        },
        {
            "id_partido_pareja": 8,
            "id_partido": 4,
            "id_pareja": 8,
            "equipo": 2
        },
        {
            "id_partido_pareja": 9,
            "id_partido": 5,
            "id_pareja": 9,
            "equipo": 1
        },
        {
            "id_partido_pareja": 10,
            "id_partido": 5,
            "id_pareja": 10,
            "equipo": 2
        }
    ]};