# Importamos las herramientas principales de FastAPI y SQLAlchemy.
# APIRouter: Para agrupar las rutas de la API.
# Depends: Para gestionar la inyección de dependencias (la sesión de la DB).
# HTTPException: Para lanzar errores HTTP.
from fastapi import APIRouter, Depends, HTTPException
# Session: Para el tipado de la variable de sesión.
from sqlalchemy.orm import Session
# Importamos la función que crea la sesión de la base de datos.
from db.database import get_db
# Importamos el modelo de SQLAlchemy que se mapea a la tabla 'pagos'.
from models.pagos import Pago

# Creamos un enrutador para definir los endpoints.
router = APIRouter()

# --- Endpoint para crear un pago (POST) ---
# Define un endpoint que responde a peticiones POST en "/pagos".
# NOTA: `pago: dict` no valida los datos de entrada. Esto es un riesgo de seguridad.
# Se recomienda usar un modelo Pydantic para validar y estructurar los datos de forma segura.
@router.post("/pagos")
def crear_pago(pago: dict, db: Session = Depends(get_db)):
    # Creamos una instancia del modelo 'Pago' con los datos del diccionario 'pago'.
    # Como no hay validación, si el diccionario no tiene las claves correctas, esto fallará.
    nuevo_pago = Pago(
        id_usuario=pago["id_usuario"],
        nombre_tarjeta=pago["nombre_tarjeta"],
        numero_tarjeta=pago["numero_tarjeta"],
        fecha_expiracion=pago["fecha_expiracion"],
        cvv=pago["cvv"]
    )
    
    # Agregamos el nuevo objeto a la sesión.
    db.add(nuevo_pago)
    # Guardamos el objeto en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener el ID asignado por la base de datos.
    db.refresh(nuevo_pago)
    
    # Devolvemos una respuesta de éxito con un mensaje y el ID del pago.
    return {"mensaje": "Pago guardado", "id_pago": nuevo_pago.id_pago}

# --- Endpoint para obtener el último método de pago de un usuario (GET) ---
# Define un endpoint que responde a peticiones GET en la ruta.
# `{usuario_id}` es un parámetro de la URL.
@router.get("/usuarios/{usuario_id}/metodo-pago")
def obtener_metodo_pago(usuario_id: int, db: Session = Depends(get_db)):
    # Buscamos el método de pago más reciente para un usuario.
    # `.filter(Pago.id_usuario == usuario_id)`: Filtra por el ID del usuario.
    # `.order_by(Pago.id_pago.desc())`: Ordena por el ID de pago en orden descendente
    # para obtener el más reciente.
    # `.first()`: Obtiene solo el primer resultado de la consulta.
    pago = db.query(Pago).filter(Pago.id_usuario == usuario_id).order_by(Pago.id_pago.desc()).first()
    
    # Si no se encuentra ningún pago, lanzamos un error 404.
    if not pago:
        raise HTTPException(status_code=404, detail="No hay método de pago guardado")
        
    # Devolvemos la información del pago.
    # NOTA DE SEGURIDAD CRÍTICA: Devolver el número de tarjeta y el CVV en una respuesta
    # es un riesgo de seguridad muy alto. Estos datos nunca deben ser expuestos.
    # En un entorno real, solo se debería devolver información parcial (ej. los últimos 4 dígitos)
    # o un token de pago.
    return {
        "nombre_tarjeta": pago.nombre_tarjeta,
        "numero_tarjeta": pago.numero_tarjeta,
        "fecha_expiracion": pago.fecha_expiracion,
        "cvv": pago.cvv
    }