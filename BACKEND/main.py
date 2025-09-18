# Importamos la clase principal de FastAPI y el middleware de CORS.
# FastAPI: La clase principal para crear la aplicación web.
from fastapi import FastAPI
# CORSMiddleware: Un componente que maneja las cabeceras CORS, permitiendo
# que tu API sea accesible desde diferentes dominios, como el de tu frontend.
from fastapi.middleware.cors import CORSMiddleware

# --- Importación de todos los enrutadores (routers) del proyecto ---
# Cada línea importa un `router` de un archivo de controlador diferente.
# Por convención, se les asigna un alias para evitar conflictos y mantener el código limpio.
# Estos archivos contienen los endpoints específicos para cada recurso (ej., usuarios, productos).
from controllers.categoria_controller import router as categoria_router
from controllers.chat_controller import router as chat_router
from controllers.detalle_pedido_controller import router as detalle_pedido_router
from controllers.inventario_controller import router as inventario_router
from controllers.item_controller import router as item_router
from controllers.notificacion_controller import router as notificacion_router
from controllers.pago_controller import router as pago_router
from controllers.pedido_controller import router as pedido_router
from controllers.producto_controller import router as producto_router
from controllers.resena_controller import router as resena_router
from controllers.rol_controller import router as rol_router
from controllers.usuario_controller import router as usuario_router
from api import compra
from controllers.ventas_controller import router as ventas_router

# --- Crear la instancia de la aplicación FastAPI ---
# Esta es la línea que inicializa tu aplicación.
app = FastAPI()

# --- Configuración del middleware de CORS ---
# Agregamos el middleware a la aplicación. Esto es crucial para la seguridad
# y el funcionamiento de tu API cuando el frontend está en un dominio o puerto diferente.
app.add_middleware(
    CORSMiddleware,
    # `allow_origins`: Lista de orígenes (dominios) que pueden acceder a tu API.
    # "http://localhost:5173" es un ejemplo común para proyectos de frontend con Vite.
    allow_origins=["*"],  # O especifica tu dominio frontend
    # `allow_credentials`: Permite que las solicitudes incluyan credenciales (ej. cookies, cabeceras de autorización).
    allow_credentials=True,
    # `allow_methods`: Lista de métodos HTTP permitidos (GET, POST, PUT, DELETE, etc.).
    # "*" permite todos los métodos.
    allow_methods=["*"],
    # `allow_headers`: Lista de cabeceras HTTP permitidas.
    # "*" permite todas las cabeceras.
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response

# --- Inclusión de todas las rutas de la API ---
# Con `app.include_router()`, registramos cada uno de los enrutadores que importamos.
# FastAPI los integra en la aplicación principal, combinando todas las rutas
# bajo una misma API.
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(usuario_router)
app.include_router(rol_router)
app.include_router(inventario_router)
app.include_router(item_router)
app.include_router(pedido_router)
app.include_router(chat_router)
app.include_router(detalle_pedido_router)
app.include_router(notificacion_router)
app.include_router(resena_router, prefix="/api")
app.include_router(compra.router)  # Nota: Se importa y se incluye de un módulo diferente.
app.include_router(pago_router)
app.include_router(ventas_router)
