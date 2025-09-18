from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from db import Base

class Pago(Base):
    __tablename__ = "pagos"
    id_pago = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    nombre_tarjeta = Column(String(100), nullable=False)
    numero_tarjeta = Column(String(20), nullable=False)
    fecha_expiracion = Column(String(5), nullable=False)
    cvv = Column(String(4), nullable=False)
    fecha_pago = Column(TIMESTAMP, server_default=func.now())

    usuario = relationship("Usuario", back_populates="pagos")