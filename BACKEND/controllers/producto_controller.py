from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import SessionLocal
from dtos.producto_dto import ProductoCreate, ProductoOut, ProductoUpdate
from models.detallepedido import DetallePedido
from models.producto import Producto

router = APIRouter(prefix="/productos", tags=["productos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProductoOut)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto


@router.get("/", response_model=list[ProductoOut])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()


@router.get("/{producto_id}", response_model=ProductoOut)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar_producto(
    producto_id: int, datos: ProductoUpdate, db: Session = Depends(get_db)
):
    producto = db.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"ok": True}


@router.get("/comprados/{cliente_id}")
def productos_comprados(cliente_id: int, db: Session = Depends(get_db)):
    productos_ids = (
        db.query(DetallePedido.producto_id)
        .filter_by(cliente_id=cliente_id)
        .distinct()
        .all()
    )
    productos = db.query(Producto).filter(
        Producto.id.in_([p.producto_id for p in productos_ids])
    ).all()
    return [{"id": p.id, "nombre": p.nombre} for p in productos]
