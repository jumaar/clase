// LÍNEA DE SEGUIMIENTO: EMPIEZA A LEER AQUÍ
// PASO 1: Entendiendo el Middleware de Manejo de Errores
// Este es un middleware de manejo de errores de Express. Su principal ventaja
// es que centraliza el manejo de errores de toda la aplicación en un solo lugar.
// Cualquier error que ocurra en una ruta será capturado y manejado por este middleware.

export const errorMiddleware = (error, req, res, next) => {
  // Si el error tiene un `statusCode`, lo usamos. Si no, usamos 500 (Internal Server Error).
  const statusCode = error.statusCode || 500
  // Si el error tiene un mensaje, lo usamos. Si no, usamos un mensaje genérico.
  const message = error.message || 'Something went wrong'

  // Logueamos el error en el servidor para poder depurarlo.
  console.error(error)

  // Enviamos una respuesta JSON al cliente con el código de estado y el mensaje de error.
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
}

// LÍNEA DE SEGUIMIENTO: CONTINÚA LEYENDO EN `app.js`
// Ahora que tenemos el middleware, necesitamos decirle a nuestra aplicación que lo use.
// Esto se hace en `app.js`.
