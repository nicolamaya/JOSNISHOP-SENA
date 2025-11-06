# Importamos la clase principal de FastAPI y el middleware de CORS.
# FastAPI: La clase principal para crear la aplicación web.
from fastapi import FastAPI
# CORSMiddleware: Un componente que maneja las cabeceras CORS, permitiendo
# que tu API sea accesible desde diferentes dominios, como el de tu frontend.
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import re
import urllib.parse

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
from controllers.bot_controller import router as bot_router
from controllers.bot_admin_controller import router as bot_admin_router
from api import compra
from controllers.ventas_controller import router as ventas_router

# --- Crear la instancia de la aplicación FastAPI ---
# Esta es la línea que inicializa tu aplicación.
app = FastAPI()

# Asegurarse de que la carpeta 'static' y 'static/uploads' existan antes de montar
base_dir = os.path.abspath(os.path.dirname(__file__))
static_dir = os.path.join(base_dir, 'static')
uploads_dir = os.path.join(static_dir, 'uploads')
os.makedirs(uploads_dir, exist_ok=True)

# Middleware to sanitize incoming static paths to avoid invalid Windows filenames
@app.middleware("http")
async def sanitize_static_path(request, call_next):
    try:
        path = request.scope.get('path', '')
        # Only operate on static paths
        if path.startswith('/static/'):
            # decode any percent-encoding
            decoded = urllib.parse.unquote(path)
            # keep the /static/... prefix and sanitize only the final filename part
            prefix = '/static/'
            rel = decoded[len(prefix):]
            # if there are subdirectories (e.g. uploads/...), keep them and only sanitize last segment
            last_slash = rel.rfind('/')
            if last_slash != -1:
                dir_part = rel[: last_slash + 1]  # includes trailing '/'
                file_part = rel[last_slash + 1 :]
            else:
                dir_part = ''
                file_part = rel
            # sanitize filename (do NOT replace path separators)
            safe_file = re.sub(r'[<>:\\"|?*]', '_', file_part)
            safe = prefix + dir_part + safe_file
            if safe != decoded:
                # update both path and raw_path (raw_path is bytes)
                request.scope['path'] = safe
                try:
                    request.scope['raw_path'] = safe.encode('utf-8')
                except Exception:
                    pass
    except Exception:
        # don't break the request on unexpected errors here
        pass
    return await call_next(request)

# Servir archivos estáticos (imágenes/videos subidos)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

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
app.include_router(bot_router)
app.include_router(bot_admin_router)
