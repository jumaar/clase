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

### Prerrequisitos

-   Node.js (v14 o superior)
-   npm
-   (Opcional) Un servidor de MySQL
-   (Opcional) Un servidor de MongoDB

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### Ejecutando la Aplicación

Puedes ejecutar la aplicación con tres fuentes de datos diferentes:

**1. Con el Sistema de Archivos Local (JSON)**

Esta es la forma más sencilla de ejecutar la aplicación, ya que no requiere ninguna base de datos externa.

```bash
node server-with-local.js
```

**2. Con MySQL**

1.  Asegúrate de tener un servidor de MySQL en ejecución.
2.  Ejecuta el script `database/mysql-schema.sql` para crear la base de datos y las tablas necesarias. Puedes hacerlo desde la línea de comandos:
    ```bash
    mysql -u tu_usuario -p < database/mysql-schema.sql
    ```
3.  Si es necesario, ajusta la configuración de la conexión en `models/mysql/movie.js`.
4.  Ejecuta la aplicación:
    ```bash
    node server-with-mysql.js
    ```

**3. Con MongoDB**

1.  Asegúrate de tener un servidor de MongoDB en ejecución.
2.  Importa los datos de ejemplo a tu base de datos. El archivo `database/mongodb-import.sh` contiene el comando que necesitas ejecutar en tu terminal:
    ```bash
    mongoimport --uri "mongodb://localhost:27017/moviesdb" --collection movies --jsonArray --file movies.json
    ```
3.  Si es necesario, ajusta la URI de conexión en `models/mongodb/movie.js`.
4.  Ejecuta la aplicación:
    ```bash
    node server-with-mongodb.js
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
