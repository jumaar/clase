import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

// LÍNEA DE SEGUIMIENTO: EMPIEZA A LEER AQUÍ
// PASO 1: Entendiendo el Modelo con MongoDB
// Este archivo es otra implementación del MODELO, esta vez para MongoDB.
// Su única responsabilidad es interactuar con la base de datos MongoDB.
// Fíjate en que la estructura es muy similar a la de MySQL, pero los métodos
// usan el driver de MongoDB.

// Configuración de la conexión a MongoDB
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('moviesdb')
    return database.collection('movies')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class MovieModel {
  // PASO 2: Obtener todas las películas
  static async getAll ({ genre }) {
    const db = await connect()

    if (genre) {
      // Si hay un género, filtramos por él (insensible a mayúsculas y minúsculas)
      return db.find({
        genre: {
          $elemMatch: {
            $regex: genre,
            $options: 'i'
          }
        }
      }).toArray()
    }

    return db.find({}).toArray()
  }

  // PASO 3: Obtener una película por su ID
  static async getById ({ id }) {
    const db = await connect()
    // En MongoDB, los IDs son objetos, no strings
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  // PASO 4: Crear una nueva película
  static async create ({ input }) {
    const db = await connect()

    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  // PASO 5: Eliminar una película
  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  // PASO 6: Actualizar una película
  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    // El método `findOneAndUpdate` nos devuelve el documento actualizado
    const { value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnNewDocument: true } // En algunas versiones del driver, es `returnDocument: 'after'`
    )

    return value
  }
}

// LÍNEA DE SEGUIMIENTO: FIN DE LA LECTURA
// Como puedes ver, la lógica es conceptualmente la misma que en el modelo de MySQL,
// pero adaptada a la forma de trabajar de MongoDB. El controlador (`controllers/movies.js`)
// podrá usar esta clase de la misma forma que usa la de MySQL, sin saber
// que la base de datos subyacente ha cambiado. ¡Esa es la magia de la
// inyección de dependencias!
