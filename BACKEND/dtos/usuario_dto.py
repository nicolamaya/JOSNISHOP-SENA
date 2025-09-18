from typing import Optional

from pydantic import BaseModel


class UsuarioBase(BaseModel):
    nombre: str
    correo: str
    contraseña: str
    rol_id: int


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[str] = None
    contraseña: Optional[str] = None
    rol_id: Optional[int] = None


class UsuarioOut(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True


class UsuarioLogin(BaseModel):
    correo: str
    contraseña: str 
    

