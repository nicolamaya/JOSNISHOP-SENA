# JOSNISHOP - Proyecto Full Stack
Este proyecto es una tienda en línea desarrollada con React (frontend) y FastAPI (backend).
Incluye instrucciones básicas de uso y configuración de dependencias iniciales.

## 📁 Estructura del Proyecto
JOSNISHOP/
├── BACKEND/    # API y lógica de negocio (Python, FastAPI)
├── frontend/   # Interfaz de usuario (React, JavaScript/TypeScript)
 

## 🚀 Instrucciones Básicas de Uso
1. Clonar el repositorio
git clone <URL-del-repositorio>
cd JOSNISHOP
 
2. Configurar el Backend
cd BACKEND


Instala las dependencias:pip install -r requirements.txt
 
Ejecuta el servidor:uvicorn main:app --reload
 
Accede a la API en http://localhost:8000

3. Configurar el Frontend
cd frontend
 
Instala las dependencias:npm install
 
Inicia la aplicación React:npm start
 
Accede a la web en http://localhost:3000

## ⚙️ Dependencias Iniciales
Backend (BACKEND/requirements.txt)
fastapi
sqlalchemy
alembic
pydantic
black
isort
ruff
y otras necesarias para la API
Frontend (frontend/package.json)
react
react-dom
react-scripts
react-router-dom
typescript
@types/react
@types/react-dom
@testing-library/react
@testing-library/jest-dom

## 📝 Notas
El backend y el frontend funcionan de manera independiente.
Puedes modificar la configuración de la base de datos en BACKEND/db/database.py.
Para agregar nuevas dependencias, usa pip install <paquete> en backend y npm install <paquete> en frontend.
Consulta la documentación interna de cada carpeta para detalles específicos.

## 👤 Autores
Josthin Paz y Nicol Amaya
• Enlace al repositorio GitHub: https://github.com/JosthinPaz/Josnishop_ 
• Estructura de carpetas documentada en README.md
• Evidencia de entorno funcionando (captura o demo corto)

Actividad 5 – Definición de estándares de codificación
Objetivo: Unificar criterios para escritura de código, nomenclatura y estructura del repositorio.
Actividades:
1. Según el stack seleccionado, crear archivo Guia_EstandaresCodigo.md con:
Reglas de nombres (variables, clases, métodos).
Comentarios y documentación interna.
Identación y estilo de código.
Ejemplos aceptados y no aceptados.
2. Instalar linters y formateadores:
ESLint para JS, Black para Python, etc.
3. Aplicar reglas en el código actual.
Guia_EstandaresCodigo.md
Actividades
Según el stack seleccionado, crear archivo Guia_EstandaresCodigo.md con:
Reglas de nombres (variables, clases, métodos).
Comentarios y documentación interna.
Identación y estilo de código.
Ejemplos aceptados y no aceptados.
Instalar linters y formateadores:
ESLint para JS/TS (frontend)
Black para Python (backend)
isort y ruff para Python (backend)
Prettier para JS/TS (opcional, frontend)

## 📦 Stack Seleccionado
Frontend: React + TypeScript
Backend: FastAPI + Python

1. Reglas de Nombres
Frontend (React/TypeScript)
Componentes: PascalCase
Ejemplo: InicioSesion.tsx, Navbar.tsx
Variables y funciones: camelCase
Ejemplo: userName, handleSubmit
Clases CSS: kebab-case
Ejemplo: .login-container, .main-header
Backend (Python/FastAPI)
Clases: PascalCase
Ejemplo: UsuarioController, ProductoModel
Variables y funciones: snake_case
Ejemplo: usuario_origen, get_productos
Archivos: snake_case
Ejemplo: usuario_controller.py, producto_dto.py

2. Comentarios y Documentación Interna
Frontend
Usa comentarios // para explicar lógica compleja.
Documenta componentes y funciones con JSDoc:/**
 * Componente de inicio de sesión
 * @returns JSX.Element
 */
 
Backend
Usa docstrings para funciones y clases:def get_productos():
    """
    Retorna la lista de productos disponibles.
    """
    ...
 
Usa # para comentarios en línea.

3. Identación y Estilo de Código
Frontend
Usa 2 espacios por nivel de indentación.
Llaves abiertas en la misma línea.
Usa prettier y eslint para formateo automático.
Backend
Usa 4 espacios por nivel de indentación.
Sigue PEP8 para Python.
Usa black, isort y ruff para formateo y linting.

4. Ejemplos Aceptados y No Aceptados
Frontend
Aceptado:
function handleLogin() {
  // Lógica de login
}
 
No aceptado:
function Handlelogin(){
    //logica
}
 
Backend
Aceptado:
def obtener_usuario_por_id(usuario_id: int) -> Usuario:
    """Obtiene un usuario por su ID."""
    pass
 
No aceptado:
def ObtenerUsuarioPorID(ID):
    pass
 

5. Linters y Formateadores
Frontend
Instala ESLint:npm install eslint --save-dev
npx eslint --init
 
Instala Prettier (opcional):npm install prettier --save-dev
 
Backend
Instala Black, isort y ruff:pip install black isort ruff