import { describe, it } from 'mocha'
import request from 'supertest'
import { createApp } from '../app.js'
import { MovieModel } from '../models/local-file-system/movie.js'
import { deepStrictEqual } from 'assert'

// LÍNEA DE SEGUIMIENTO: EMPIEZA A LEER AQUÍ
// PASO 1: Entendiendo las Pruebas Unitarias
// Este archivo contiene las pruebas para la API de películas.
// Usamos `mocha` para estructurar las pruebas (`describe`, `it`) y `supertest`
// para hacer peticiones HTTP a nuestra aplicación.

describe('Movies API', () => {
  const app = createApp({ movieModel: MovieModel })

  describe('GET /movies', () => {
    it('should return a list of movies', (done) => {
      request(app)
        .get('/movies')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          deepStrictEqual(res.body.length > 0, true)
          done()
        })
    })

    it('should return a list of movies filtered by genre', (done) => {
      request(app)
        .get('/movies?genre=Action')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          deepStrictEqual(res.body.every(movie => movie.genre.includes('Action')), true)
          done()
        })
    })
  })

  describe('GET /movies/:id', () => {
    it('should return a 404 error if the movie does not exist', (done) => {
      request(app)
        .get('/movies/invalid-id')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          deepStrictEqual(res.body, { message: 'Movie not found' })
          done()
        })
    })
  })

  describe('POST /movies', () => {
    it('should create a new movie', (done) => {
      const newMovie = {
        title: 'Test Movie',
        year: 2023,
        director: 'Test Director',
        duration: 120,
        poster: 'http://example.com/poster.jpg',
        genre: ['Action'],
        rate: 5.0
      }

      request(app)
        .post('/movies')
        .send(newMovie)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          deepStrictEqual(res.body.title, 'Test Movie')
          done()
        })
    })

    it('should return a 400 error if the movie data is invalid', (done) => {
      const invalidMovie = {
        title: 'Test Movie'
        // Faltan campos requeridos
      }

      request(app)
        .post('/movies')
        .send(invalidMovie)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          deepStrictEqual(res.body.success, false)
          deepStrictEqual(res.body.statusCode, 400)
          done()
        })
    })
  })
})

// LÍNEA DE SEGUIMIENTO: FIN DE LA LECTURA
// Para ejecutar estas pruebas, puedes usar el comando `mocha` en tu terminal.
// Estas pruebas te ayudan a asegurarte de que tu API funciona como se espera
// y a detectar errores rápidamente si haces cambios en el futuro.
