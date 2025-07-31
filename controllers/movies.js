import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  // Ahora los métodos no son estáticos, porque dependen de la instancia del controlador
  // que tiene el modelo inyectado.
  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  create = async (req, res, next) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      // Creamos un error con el statusCode y el mensaje y lo pasamos a next()
      const error = new Error(result.error.message)
      error.statusCode = 400
      return next(error)
    }

    const newMovie = await this.movieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.movieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }

  update = async (req, res, next) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      const error = new Error(result.error.message)
      error.statusCode = 400
      return next(error)
    }

    const { id } = req.params

    const updatedMovie = await this.movieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
  }
}

// LÍNEA DE SEGUIMIENTO: CONTINÚA LEYENDO EN `routes/movies.js`
// Ahora que el controlador está listo para recibir el modelo, tenemos que
// modificar el enrutador para que se lo pase.
