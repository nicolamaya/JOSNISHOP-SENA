from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.pagos import Pago
from dtos.pago_dto import PagoCreate, PagoOut
from utils.crypto_utils import encrypt_data, decrypt_data

router = APIRouter()

@router.post("/pagos", response_model=PagoOut)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    # Ciframos los datos sensibles
    nuevo_pago = Pago(
        id_usuario=pago.id_usuario,
        nombre_tarjeta=encrypt_data(pago.nombre_tarjeta),
        numero_tarjeta=encrypt_data(pago.numero_tarjeta),
        fecha_expiracion=encrypt_data(pago.fecha_expiracion),
        cvv=encrypt_data(pago.cvv)
    )
    
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    
    # Desciframos los datos para la respuesta
    return PagoOut(
        id_pago=nuevo_pago.id_pago,
        id_usuario=nuevo_pago.id_usuario,
        nombre_tarjeta=decrypt_data(nuevo_pago.nombre_tarjeta),
        numero_tarjeta="*" * 12 + decrypt_data(nuevo_pago.numero_tarjeta)[-4:],  # Solo mostramos los últimos 4 dígitos
        fecha_expiracion=decrypt_data(nuevo_pago.fecha_expiracion),
        cvv="***"  # Nunca mostramos el CVV completo
    )

@router.get("/usuarios/{usuario_id}/metodo-pago", response_model=PagoOut)
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
        
    # Devolvemos la información del pago con los campos requeridos
    return PagoOut(
        id_pago=pago.id_pago,
        id_usuario=pago.id_usuario,
        nombre_tarjeta=decrypt_data(pago.nombre_tarjeta),
        numero_tarjeta="*" * 12 + decrypt_data(pago.numero_tarjeta)[-4:],  # Solo mostramos los últimos 4 dígitos
        fecha_expiracion=decrypt_data(pago.fecha_expiracion),
        cvv="***"  # Nunca mostramos el CVV completo
    )
    # En un entorno real, solo se debería devolver información parcial (ej. los últimos 4 dígitos)
    # o un token de pago.
    return {
        "nombre_tarjeta": pago.nombre_tarjeta,
        "numero_tarjeta": pago.numero_tarjeta,
        "fecha_expiracion": pago.fecha_expiracion,
        "cvv": pago.cvv
    }