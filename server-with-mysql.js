import { createApp } from './app.js'
import { MovieModel } from './models/mysql/movie.js'

const app = createApp({ movieModel: MovieModel })

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
