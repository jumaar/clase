import 'dotenv/config'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

// --- PUNTO CRÍTICO ---
// Asegúrate de que esta URI sea la correcta.
// Si usas una base de datos en la nube (Atlas), crea un archivo .env y asegúrate de que MONGODB_URI esté definida.
// Si es local, verifica que MongoDB esté corriendo.
const uri = process.env.MONGODB_URI // || 'mongodb://localhost:27017/moviesdb'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Variable para guardar la referencia a la COLECCIÓN de películas
let moviesCollection

// Función de conexión mejorada con más registros para depuración
export async function connect () {
  // Si ya tenemos la conexión a la colección, la reutilizamos.
  if (moviesCollection) return moviesCollection

  try {
    console.log('Intentando conectar al cliente de MongoDB...')
    await client.connect()
    console.log('✅ Cliente de MongoDB conectado exitosamente.')

    const database = client.db('moviesdb')
    console.log(`-> Accediendo a la base de datos: 'moviesdb'`)

    moviesCollection = database.collection('movies')
    console.log(`-> Accediendo a la colección: 'movies'`)

    console.log('✅ Conexión a la base de datos y colección establecida.')
    return moviesCollection
  } catch (error) {
    // Si algo sale mal, lo mostramos en consola y cerramos la conexión.
    console.error('❌ Error conectando a la base de datos:', error)
    await client.close()
    throw new Error('Error al conectar con la base de datos.')
  }
}

export class MovieModel {
  // Obtener todas las películas
  static async getAll ({ genre }) {
    const moviesCollection = await connect()

    if (genre) {
      // Búsqueda insensible a mayúsculas/minúsculas
      const query = { genre: { $elemMatch: { $regex: new RegExp(genre, 'i') } } }
      return moviesCollection.find(query).toArray()
    }

    return moviesCollection.find({}).toArray()
  }

  // Obtener una película por su ID (el UUID que tú creaste)
  static async getById ({ id }) {
    const moviesCollection = await connect()
    // Buscamos el documento que coincida con el campo 'id'
    return moviesCollection.findOne({ id: id })
  }

  // Crear una nueva película
  static async create ({ input }) {
    const moviesCollection = await connect()
    const { insertedId } = await moviesCollection.insertOne(input)
    return {
      // Devolvemos el _id de MongoDB como 'mongoId' para evitar confusiones
      mongoId: insertedId,
      ...input
    }
  }

  // Eliminar una película por su ID (el UUID)
  static async delete ({ id }) {
    const moviesCollection = await connect()
    // Eliminamos el documento que coincida con el campo 'id'
    const { deletedCount } = await moviesCollection.deleteOne({ id: id })
    return deletedCount > 0
  }

  // Actualizar una película por su ID (el UUID)
  static async update ({ id, input }) {
    const moviesCollection = await connect()
    
    // Buscamos por el campo 'id' y actualizamos el documento
    const result = await moviesCollection.findOneAndUpdate(
      { id: id },
      { $set: input },
      { returnDocument: 'after' } // Devuelve el documento DESPUÉS de actualizarlo
    )

    return result
  }
}