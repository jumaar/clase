import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import { errorMiddleware } from './middlewares/error.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/movies', createMovieRouter({ movieModel }))

  // LÍNEA DE SEGUIMIENTO: PASO 2
  // Aquí es donde añadimos el middleware de manejo de errores.
  // Debe ser el último middleware que se añade.
  app.use(errorMiddleware)

  return app
}
