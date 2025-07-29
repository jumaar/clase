# API de Películas - Arquitectura MVC con Inyección de Dependencias

Este repositorio es un proyecto académico diseñado para estudiar y entender la arquitectura **Modelo-Vista-Controlador (MVC)** y el patrón de diseño de **Inyección de Dependencias** en una API de Node.js con Express.

## Arquitectura

La aplicación sigue una arquitectura MVC clásica, pero con un enfoque moderno que permite cambiar la fuente de datos de una forma muy sencilla gracias a la inyección de dependencias.

-   **Modelo:** Se encarga de toda la lógica de datos. No sabe nada sobre cómo se presentan los datos, solo cómo obtenerlos, guardarlos, actualizarlos y eliminarlos. En este proyecto, tenemos tres implementaciones del modelo:
    -   `models/local-file-system/movie.js`: Usa un archivo JSON como fuente de datos.
    -   `models/mysql/movie.js`: Usa una base de datos MySQL.
    -   `models/mongodb/movie.js`: Usa una base de datos MongoDB.
-   **Vista:** En este caso, la "vista" es el cliente que consume la API (por ejemplo, una aplicación web, una aplicación móvil o herramientas como Postman). El archivo `web/index.html` es un ejemplo simple de una vista que consume esta API.
-   **Controlador:** Actúa como el intermediario entre el modelo y la vista. Recibe las peticiones, le pide los datos al modelo y los devuelve a la vista. Gracias a la inyección de dependencias, el controlador no sabe qué base de datos se está usando, lo que lo hace muy flexible y fácil de probar.

## Inyección de Dependencias

El corazón de este proyecto es la inyección de dependencias. En lugar de que el controlador importe directamente el modelo que va a usar, se lo "inyectamos" desde fuera. Esto se hace en los archivos `server-*.js`:

-   `server-with-local.js`
-   `server-with-mysql.js`
-   `server-with-mongodb.js`

Cada uno de estos archivos importa un modelo diferente y se lo pasa a la aplicación principal. Esto nos permite cambiar de base de datos con solo ejecutar un archivo diferente, sin tener que modificar el código del controlador.

## Línea de Estudio Recomendada

Para entender el flujo completo de una petición en la aplicación, te recomendamos seguir esta "Línea de Estudio". Busca los comentarios `LÍNEA DE SEGUIMIENTO` en los archivos, que te guiarán paso a paso.

El flujo se entiende mejor siguiendo este orden:

1.  **`server-with-local.js` (El Punto de Partida)**
    *   **Qué observar:** Cómo se importa el modelo (`MovieModel`) y la función `createApp`. Fíjate en cómo se "inyecta" el modelo en la aplicación. Este es el núcleo de la inyección de dependencias.

2.  **`app.js` (El Ensamblador de la Aplicación)**
    *   **Qué observar:** Cómo la función `createApp` recibe el modelo. Fíjate en el orden de los middlewares: primero los que procesan la petición (`cors`, `json`) y al final del todo, el middleware de manejo de errores.

3.  **`routes/movies.js` (El Enrutador)**
    *   **Qué observar:** Cómo la función `createMovieRouter` recibe el modelo y crea una instancia del `MovieController`, pasándole el modelo. Aquí es donde se conectan las rutas (ej. `GET /movies`) con los métodos específicos del controlador.

4.  **`controllers/movies.js` (El Controlador)**
    *   **Qué observar:** Cómo el constructor recibe y almacena el modelo. Fíjate en que los métodos (`getAll`, `getById`, etc.) usan `this.movieModel` para acceder a los datos, sin saber de dónde vienen.

5.  **`models/local-file-system/movie.js` (El Modelo)**
    *   **Qué observar:** La implementación concreta de los métodos de acceso a datos. Este archivo sabe cómo leer y escribir en un `json`. Compara este archivo con `models/mysql/movie.js` o `models/mongodb/movie.js` para ver cómo la misma interfaz se implementa de formas completamente diferentes.

6.  **`middlewares/cors.js` y `middlewares/error.js` (Los Ayudantes)**
    *   **Qué observar:** Entiende cómo estos middlewares se insertan en el flujo de la petición para manejar tareas transversales (CORS, manejo de errores) antes y después de que la lógica principal sea ejecutada por el controlador.

7.  **`test/movies.test.js` (El Verificador)**
    *   **Qué observar:** Cómo las pruebas unitarias importan `createApp` y le inyectan un modelo de prueba (el local) para verificar el comportamiento de la API de forma aislada, sin depender de bases de datos externas.

Siguiendo este orden, tendrás una visión completa y estructurada de cómo todas las piezas del rompecabezas encajan.

## Cómo Empezar

### 1. Prerrequisitos

-   Node.js (v14 o superior)
-   npm
-   Un servidor de MySQL (si quieres usar la base de datos MySQL)

### 2. Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### 3. Configuración de la Base de Datos MySQL

1.  **Inicia tu servidor de MySQL.**
2.  **Crea la base de datos y las tablas.** El siguiente comando ejecutará el script `mysql-schema.sql`, que creará la base de datos `moviesdb` y las tablas necesarias. **Importante:** Asegúrate de que el usuario de MySQL que uses tenga permisos para crear bases de datos.

    ```bash
    # Reemplaza 'tu_usuario' con tu nombre de usuario de MySQL
    mysql -u tu_usuario -p < database/mysql-schema.sql
    ```
    Se te pedirá la contraseña de tu usuario de MySQL.

3.  **(Opcional) Configura las credenciales.** Por defecto, la aplicación intentará conectarse con el usuario `root` y la contraseña `1234`. Si necesitas cambiar esto, puedes crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

    ```
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_NAME=moviesdb
    DB_PORT=3306
    ```
    La aplicación cargará estas variables automáticamente.

### 4. Ejecutando la Aplicación

Para iniciar la API con la conexión a MySQL, ejecuta:

```bash
node server-with-mysql.js
```

Verás un mensaje en la consola indicando que el servidor está escuchando en el puerto `1234`: `server listening on port http://localhost:1234`

### 5. Usando la API

Una vez que el servidor esté en marcha, puedes interactuar con la API. Aquí tienes algunos ejemplos usando `curl`:

**Obtener todas las películas**

```bash
curl http://localhost:1234/movies
```

**Obtener todas las películas de un género específico**

```bash
# Reemplaza 'Action' con el género que quieras
curl http://localhost:1234/movies?genre=Action
```

**Obtener una película por su ID**

```bash
# Reemplaza 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' con un ID de película válido
curl http://localhost:1234/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3
```

**Crear una nueva película**

```bash
curl -X POST http://localhost:1234/movies \
-H "Content-Type: application/json" \
-d '{
  "title": "The Matrix",
  "year": 1999,
  "director": "Lana Wachowski",
  "duration": 136,
  "poster": "https://i.ebayimg.com/images/g/Q~MAAOSw22lZzuMD/s-l1600.jpg",
  "genre": ["Sci-Fi"],
  "rate": 8.7
}'
```

**Actualizar una película**

```bash
# Reemplaza 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' con el ID de la película que quieras actualizar
curl -X PATCH http://localhost:1234/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3 \
-H "Content-Type: application/json" \
-d '{
  "rate": 9.9
}'
```

**Eliminar una película**

```bash
# Reemplaza 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' con el ID de la película que quieras eliminar
curl -X DELETE http://localhost:1234/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3
```

### Ejecutando las Pruebas

Este proyecto incluye pruebas unitarias para la API. Para ejecutarlas, simplemente usa el siguiente comando:

```bash
npm test
```

Las pruebas usan el modelo de sistema de archivos local para no depender de bases de datos externas.

## Estructura de Archivos

```
.
├── controllers
│   └── movies.js         # Controlador de películas
├── database
│   ├── mongodb-import.sh # Script para importar datos a MongoDB
│   └── mysql-schema.sql  # Script para crear el esquema de MySQL
├── middlewares
│   ├── cors.js           # Middleware de CORS
│   └── error.js          # Middleware de manejo de errores
├── models
│   ├── local-file-system
│   │   └── movie.js      # Modelo de sistema de archivos local
│   ├── mongodb
│   │   └── movie.js      # Modelo de MongoDB
│   └── mysql
│       └── movie.js      # Modelo de MySQL
├── routes
│   └── movies.js         # Enrutador de películas
├── schemas
│   └── movies.js         # Esquemas de validación con Zod
├── test
│   └── movies.test.js    # Pruebas unitarias
├── web
│   └── index.html        # Ejemplo de una vista
├── app.js                # Lógica principal de la aplicación Express
├── package.json
├── README.md
├── server-with-local.js  # Punto de entrada para el modelo local
├── server-with-mongodb.js # Punto de entrada para el modelo de MongoDB
└── server-with-mysql.js   # Punto de entrada para el modelo de MySQL
```
