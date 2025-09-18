from pydantic import BaseModel

class PagoCreate(BaseModel):
    id_usuario: int
    nombre_tarjeta: str
    numero_tarjeta: str
    fecha_expiracion: str
    cvv: str

class PagoOut(PagoCreate):
    id_pago: int

    class Config:
        orm_mode = True