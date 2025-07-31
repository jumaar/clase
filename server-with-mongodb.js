import { createApp } from './app.js'
import { MovieModel, connect } from './models/mongodb/movie.js'

const start = async () => {
  // Nos conectamos a la base de datos ANTES de iniciar el servidor
  await connect()

  const app = createApp({ movieModel: MovieModel })

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}

start()
