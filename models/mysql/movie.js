import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

// LÍNEA DE SEGUIMIENTO: EMPIEZA A LEER AQUÍ
// PASO 1: Entendiendo el Modelo con MySQL
// Este archivo es una de las implementaciones del MODELO. Su única responsabilidad
// es interactuar directamente con la base de datos MySQL. No sabe nada sobre
// controladores o vistas. Solo sabe cómo hablar con MySQL.

export class MovieModel {
  // PASO 2: Obtener todas las películas
  static async getAll ({ genre }) {
    // Si hay un género, filtramos por él.
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // Obtenemos el id del género
      const [genres] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      // si no encontramos el género, no hay películas
      if (genres.length === 0) return []

      const [{ id }] = genres

      // Obtenemos todas las películas del género
      const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate
         FROM movie m
         INNER JOIN movie_genres mg ON m.id = mg.movie_id
         WHERE mg.genre_id = ?;`,
        [id]
      )

      return movies
    }

    // Si no hay género, obtenemos todas las películas
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate
       FROM movie;`
    )

    return movies
  }

  // PASO 3: Obtener una película por su ID
  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate
       FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  // PASO 4: Crear una nueva película
  static async create ({ input }) {
    const {
      genre: genreInput, // genre es un array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // Creamos un id de tipo UUID v4
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
         VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // Manejar el error, puede que la película ya exista
      // throw new Error('Error creating movie')
      // lo ideal sería propagar el error y que el controlador lo capture
      // y decida qué hacer con él.
      console.log(e)
    }

    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate
       FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  // PASO 5: Eliminar una película
  static async delete ({ id }) {
    const [result] = await connection.query(
      'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    )

    if (result.affectedRows === 0) return false

    return true
  }

  // PASO 6: Actualizar una película
  static async update ({ id, input }) {
    const {
      genre,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate
       FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    const movie = movies[0]

    const updatedMovie = {
      ...movie,
      ...input
    }

    await connection.query(
      `UPDATE movie
       SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
       WHERE id = UUID_TO_BIN(?);`,
      [
        updatedMovie.title,
        updatedMovie.year,
        updatedMovie.director,
        updatedMovie.duration,
        updatedMovie.poster,
        updatedMovie.rate,
        id
      ]
    )

    return updatedMovie
  }
}

// LÍNEA DE SEGUIMIENTO: FIN DE LA LECTURA
// Una vez que hayas entendido cómo cada método interactúa con la base de datos,
// puedes pasar al siguiente archivo del modelo (por ejemplo, `models/mongodb/movie.js`)
// para ver cómo se implementaría la misma lógica con otra base de datos.
// O puedes ir al controlador (`controllers/movies.js`) para ver cómo, gracias a la
// inyección de dependencias, puede usar este modelo sin saber que es MySQL.
