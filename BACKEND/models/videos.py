from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    url = Column(String(200))
    fecha_subida = Column(DateTime)

    producto = relationship("Producto", back_populates="videos")
