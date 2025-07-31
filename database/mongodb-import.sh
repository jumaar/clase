#!/bin/bash

# Obtener la ruta del directorio donde se encuentra el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# LÍNEA DE SEGUIMIENTO: EMPIEZA A LEER AQUÍ
# PASO 1: Importando los Datos a MongoDB
# Este script contiene el comando para importar los datos del archivo `movies.json`
# a tu base de datos MongoDB.
#
# Antes de ejecutar la aplicación, ejecuta este script desde tu terminal
# para poblar la base de datos.
#
# Uso:
# 1. Abre una terminal.
# 2. Navega hasta el directorio 'database' de tu proyecto.
# 3. Ejecuta: ./mongodb-import.sh

echo "Importando datos a la base de datos 'moviesdb' en MongoDB..."

mongoimport --uri "mongodb://localhost:27017/moviesdb" --collection movies --jsonArray --file "${SCRIPT_DIR}/../movies.json"

echo "¡Importación completada!"
echo "Ahora puedes ejecutar la aplicación. Debería poder conectarse a la base de datos y obtener los datos."
