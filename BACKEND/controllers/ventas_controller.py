from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.session import SessionLocal
from fastapi.responses import JSONResponse
from sqlalchemy import text

router = APIRouter(prefix="/ventas", tags=["ventas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def consultar_ventas(
    anio: int = Query(...),
    mes: int = Query(None),
    dia: int = Query(None),
    db: Session = Depends(get_db)
):
    # Llama al SP con los parámetros recibidos
    result = db.execute(
        text("CALL SP_ConsultarVentasVendedor(:anio, :mes, :dia)"),
        {"anio": anio, "mes": mes, "dia": dia}
    )
    # Obtén los resultados como lista de dicts
    rows = result.fetchall()
    columns = result.keys()
    data = [dict(zip(columns, row)) for row in rows]
    return JSONResponse(content=data)