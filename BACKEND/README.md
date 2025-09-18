# JOSNISHOP - Backend

Bienvenido al backend de **JOSNISHOP**, una API para la gestión de una tienda en línea, desarrollada con **FastAPI**, **SQLAlchemy** y **MariaDB/MySQL**.

---

## 📁 Estructura del Proyecto

```
BACKEND/
│
├── main.py                  # Punto de entrada de la aplicación FastAPI
├── requirements.txt         # Dependencias del proyecto
├── alembic.ini              # Configuración de migraciones Alembic
├── pyproject.toml           # Configuración de linters y formateadores
├── README.md                # Este archivo
│
├── controllers/             # Lógica de negocio y rutas por entidad
│   ├── categoria_controller.py
│   ├── producto_controller.py
│   ├── usuario_controller.py
│   ├── rol_controller.py
│   ├── inventario_controller.py
│   ├── item_controller.py
│   ├── pedido_controller.py
│   ├── chat_controller.py
│   ├── detalle_pedido_controller.py
│   ├── notificacion_controller.py
│   ├── resena_controller.py
│   ├── video_controller.py
│   └── ...
│
├── db/                      # Configuración de la base de datos y sesión
│   ├── __init__.py
│   ├── base.py
│   ├── database.py
│   └── session.py
│
├── dtos/                    # Esquemas Pydantic para validación y serialización
│   ├── categoria_dto.py
│   ├── producto_dto.py
│   ├── usuario_dto.py
│   ├── rol_dto.py
│   ├── inventario_dto.py
│   ├── item_dto.py
│   ├── pedido_dto.py
│   ├── chat_dto.py
│   ├── detalle_pedido_dto.py
│   ├── notificacion_dto.py
│   ├── resena_dto.py
│   └── video_dto.py
│
├── ENDPOINTS/               # Requests de prueba para Bruno
│   ├── Categoria/
│   ├── Productos/
│   ├── Usuarios/
│   ├── Roles/
│   ├── Inventario/
│   ├── Item/
│   ├── DetallePedido/
│   ├── Notificaciones/
│   ├── Resenas/
│   ├── Videos/
│   ├── Chats/
│   └── bruno.json
│
├── migraciones/             # Migraciones de base de datos (Alembic)
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions/
│
├── models/                  # Modelos ORM de SQLAlchemy
│   ├── __init__.py
│   ├── categoria.py
│   ├── producto.py
│   ├── usuarios.py
│   ├── roles.py
│   ├── inventario.py
│   ├── item.py
│   ├── pedido.py
│   ├── detallepedido.py
│   ├── videos.py
│   ├── notificaciones.py
│   ├── chatbox.py
│   └── resenas.py
│
├── utils/                   # Utilidades (correo, JWT, etc.)
│   ├── email_utils.py
│   ├── jwt_utils.py
│   └── ...
│
├── .gitignore
├── env.text
├── SQL_JOSNISHOP_final.sql  # Script SQL para crear la base de datos
├── test.db                  # Base de datos de pruebas (SQLite)
├── __pycache__/             # Archivos temporales de Python
├── .idea/                   # Configuración de proyecto para IDE (puedes ignorar)
└── .ruff_cache/             # Cache de linter Ruff
```

---

## 🚀 Tecnologías Utilizadas

- **Python 3.12+**
- **FastAPI** (framework web)
- **SQLAlchemy** (ORM)
- **Alembic** (migraciones)
- **MariaDB/MySQL** (base de datos principal)
- **SQLite** (base de datos de pruebas)
- **Pydantic** (validación de datos)
- **Bruno** (colección de pruebas de endpoints)
- **black** (formateador automático de código Python)
- **isort** (ordenador de imports)
- **ruff** (linter ultrarrápido)

---

## ⚙️ Instalación y Puesta en Marcha

1. **Clona el repositorio y accede a la carpeta del backend:**

   ```sh
   git clone <url-del-repo>
   cd JOSNISHOP-oficial/BACKEND
   ```

2. **Crea y activa un entorno virtual (opcional pero recomendado):**

   ```sh
   python -m venv env
   .\venv\Scripts\activate
   ```

3. **Instala las dependencias:**

   ```sh
   pip install -r requirements.txt
   ```

4. **Configura la base de datos:**  
   Edita la cadena de conexión en `db/database.py` y en `alembic.ini` según tus credenciales y entorno.  
   Si usas MariaDB/MySQL, asegúrate de tener el servidor corriendo y el usuario con permisos.

5. **Ejecuta las migraciones para crear las tablas:**

   ```sh
   alembic upgrade head
   ```

6. **Inicia el servidor de desarrollo:**

   ```sh
   uvicorn main:app --reload
   ```

   El backend estará disponible en: [http://localhost:8000](http://localhost:8000)

---

## 🧹 Formateo y Linting de Código

- **Formatear automáticamente todo el código con black:**
  ```sh
  black .
  ```

- **Ordenar imports con isort:**
  ```sh
  isort .
  ```

- **Revisar y corregir el código con ruff:**
  ```sh
  ruff check . --fix
  ```

- La configuración personalizada de estas herramientas está en `pyproject.toml`.

---

## 📚 Endpoints Principales

- `GET /categorias` — Listado de categorías
- `GET /productos` — Listado de productos
- `GET /usuarios` — Listado de usuarios
- `GET /roles` — Listado de roles
- `GET /inventarios` — Inventario de productos
- `GET /items` — Ítems de la tienda
- `GET /pedidos` — Pedidos
- `GET /detalles_pedido` — Detalles de pedido
- `GET /notificaciones` — Notificaciones
- `GET /resenas` — Reseñas de productos
- `GET /videos` — Videos de productos
- `GET /chats` — Mensajes de chat

Consulta y prueba todos los endpoints en la documentación interactiva de FastAPI:  
[http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Pruebas con Bruno

- En la carpeta `ENDPOINTS/` tienes subcarpetas con archivos `.bru` para probar todos los endpoints principales.
- Abre Bruno, importa la carpeta y ejecuta las requests para verificar el funcionamiento de la API.

---

## 📝 Notas y Funcionalidades Especiales

- **Organización:** Los modelos, controladores y esquemas están organizados por entidad para facilitar la escalabilidad y el mantenimiento.
- **Migraciones:** Todas las migraciones de base de datos se gestionan con Alembic en la carpeta `migraciones/`.
- **Validación:** Los esquemas de validación y serialización están en la carpeta `dtos/`.
- **Pruebas:** Requests de prueba para Bruno en la carpeta `ENDPOINTS/`.
- **Notificaciones:** El sistema envía alertas por correo al vendedor cada vez que se publica una nueva reseña (ver `utils/email_utils.py` y `controllers/resena_controller.py`).
- **Filtrado de comentarios:** Los comentarios ofensivos o inapropiados son detectados y bloqueados antes de publicar o editar una reseña.
- **Configuración de IDE:** La carpeta `.idea/` es solo para configuración de PyCharm/VSCode y puede ser ignorada.
- **Calidad de código:** Usa `black`, `isort` y `ruff` para mantener el código limpio y consistente.

---

## 🤝 Contribuciones

¿Quieres contribuir? ¡Eres bienvenido!  
Por favor, abre un issue o pull request para sugerencias, mejoras o reportar errores.

---

## 👤 Autor

Josthin Paz y Nicol Amaya

---

### 📦 ¿Cómo guardar todas tus dependencias actuales?

Para guardar todas las dependencias instaladas en tu entorno virtual en el archivo `requirements.txt`, ejecuta este comando en la terminal:

```sh
pip freeze > requirements.txt
```

Luego, sube el archivo `requirements.txt` a tu repositorio con tu gestor de versiones.

---

## 🛠️ Recomendaciones para Ingenieros en Sistemas

- Lee y entiende la estructura del proyecto antes de modificar o agregar nuevas funcionalidades.
- Usa entornos virtuales para evitar conflictos de dependencias.
- Mantén la base de datos y las migraciones actualizadas.
- Realiza pruebas de los endpoints con Bruno o la documentación interactiva de FastAPI.
- Sigue las convenciones de estilo y calidad de código (black, isort, ruff).
- Documenta cualquier cambio relevante en el código o en este README.