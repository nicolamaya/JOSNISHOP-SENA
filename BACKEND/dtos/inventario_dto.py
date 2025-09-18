from pydantic import BaseModel
from datetime import datetime


class InventarioBase(BaseModel):
    producto_id: int
    cantidad: int
    stock_minimo: int
    fecha_actualizacion: datetime


class InventarioCreate(InventarioBase):
    pass


class InventarioUpdate(BaseModel):
    producto_id: int | None = None
    cantidad: int | None = None
    stock_minimo: int | None = None
    fecha_actualizacion: datetime | None = None


class InventarioOut(InventarioBase):
    id: int

    class Config:
        orm_mode = True
