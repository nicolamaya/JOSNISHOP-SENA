from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Usuario(Base):
    __tablename__ = "usuarios"
    id_usuario = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    correo = Column(String(100))
    contraseña = Column(String(255))
    rol_id = Column(Integer, ForeignKey("roles.id_rol"))
    estado = Column(Boolean)

    rol = relationship("Rol", back_populates="usuarios")
    pagos = relationship("Pago", back_populates="usuario")