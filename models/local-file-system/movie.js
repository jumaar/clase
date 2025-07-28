import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils.js'

const movies = readJSON('./movies.json')

// CÍRCULO 3: EL MODELO (La despensa del restaurante)
// Este es el modelo. Representa los datos y la lógica de negocio.
// Es la DESPENSA o el ALMACÉN de ingredientes del restaurante.
// Se encarga de interactuar directamente con los datos, ya sea un archivo,
// una base de datos, etc. No sabe nada del cliente ni del cocinero.
// Solo sabe cómo obtener, guardar, actualizar y eliminar ingredientes (datos).

export class MovieModel {
  // El encargado de la despensa busca todas las películas.
  static async getAll ({ genre }) {
    if (genre) {
      // Si el cocinero pide filtrar por género, el encargado lo hace.
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    // Si no, devuelve todos los ingredientes que tiene.
    return movies
  }

  // El encargado de la despensa busca una película por su ID.
  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  // El encargado de la despensa guarda una nueva película.
  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(), // Le pone una etiqueta única (ID).
      ...input
    }

    // La guarda en el almacén (el array `movies`).
    movies.push(newMovie)

    return newMovie
  }

  // El encargado de la despensa elimina una película.
  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false // Si no la encuentra, avisa.

    movies.splice(movieIndex, 1)
    return true
  }

  // El encargado de la despensa actualiza una película.
  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false // Si no la encuentra, avisa.

    // Reemplaza la película antigua por la nueva.
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }

    return movies[movieIndex]
  }
}
