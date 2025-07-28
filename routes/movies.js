import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

// LÍNEA DE SEGUIMIENTO: PASO 2
// Este es el enrutador. Ahora, en lugar de exportar el `moviesRouter` directamente,
// vamos a exportar una función que crea el enrutador.
// Esta función recibirá el `movieModel` como parámetro.

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()

  // Creamos una instancia del controlador, pasándole el modelo.
  const movieController = new MovieController({ movieModel })

  // Asociamos las rutas a los métodos de la instancia del controlador.
  moviesRouter.get('/', movieController.getAll)
  moviesRouter.post('/', movieController.create)

  moviesRouter.get('/:id', movieController.getById)
  moviesRouter.delete('/:id', movieController.delete)
  moviesRouter.patch('/:id', movieController.update)

  return moviesRouter
}

// LÍNEA DE SEGUIMIENTO: CONTINÚA LEYENDO EN `app.js`
// El siguiente paso es modificar `app.js` para que use esta nueva función
// y le pase el modelo.
