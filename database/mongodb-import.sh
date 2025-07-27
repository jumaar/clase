#!/binbin/bash

# LÍNEA DE SEGUIMIENTO: EMPIEZA A LEER AQUÍ
# PASO 1: Importando los Datos a MongoDB
# Este script contiene el comando para importar los datos del archivo `movies.json`
# a tu base de datos MongoDB.
# Antes de ejecutar la aplicación con el modelo de MongoDB, deberías ejecutar
# este script en tu terminal.

# mongoimport --uri "mongodb://localhost:27017/moviesdb" --collection movies --jsonArray --file ../movies.json

echo "Para importar los datos a MongoDB, ejecuta el siguiente comando en tu terminal:"
echo "mongoimport --uri \"mongodb://localhost:27017/moviesdb\" --collection movies --jsonArray --file movies.json"

# LÍNEA DE SEGUIMIENTO: FIN DE LA LECTURA
# Una vez que hayas ejecutado este comando, puedes volver a intentar ejecutar la aplicación
# con el modelo de MongoDB. Ahora debería poder conectarse a la base de datos y obtener los datos.
