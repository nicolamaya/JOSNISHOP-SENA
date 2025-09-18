import React, { useEffect, useState } from "react";
import ModalResena from "./ModalResena";

interface Resena {
  id: number;
  cliente_id: number;
  producto_id: number;
  calificacion: number;
  comentario: string;
  respuesta_vendedor?: string;
}

interface Props {
  esVendedor: boolean;
  vendedorId?: number;
  productoId?: number;
  onResenaEnviada?: () => void;
}

const ResenasPanel: React.FC<Props> = ({ esVendedor, vendedorId, productoId, onResenaEnviada }) => {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [respuesta, setRespuesta] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoResena, setEditandoResena] = useState<Resena | null>(null);
  const [error, setError] = useState("");
  const [puedeResenar, setPuedeResenar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalModoEdicion, setModalModoEdicion] = useState(false);

  const userId = Number(localStorage.getItem("userId"));

  // Cargar reseñas según el rol
  useEffect(() => {
    if (esVendedor && vendedorId) {
      fetch(`/api/resenas/vendedor/${vendedorId}`)
        .then(res => res.json())
        .then(data => setResenas(data));
    } else if (!esVendedor && productoId) {
      fetch(`/api/resenas/producto/${productoId}`)
        .then(res => res.json())
        .then(data => setResenas(data));
    }
  }, [esVendedor, vendedorId, productoId, showModal, modalModoEdicion]);

  // Solo para cliente: verificar si puede dejar reseña
  useEffect(() => {
    if (!esVendedor && productoId) {
      fetch(`/api/resenas/puede-resenar?producto_id=${productoId}&cliente_id=${userId}`)
        .then(res => res.json())
        .then(data => setPuedeResenar(data));
    }
  }, [productoId, esVendedor, showModal, modalModoEdicion, userId]);

  // Vendedor responde o edita respuesta
  const handleRespuesta = async (e: React.FormEvent, resenaId: number) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/resenas/${resenaId}/respuesta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta }),
      });
      if (!res.ok) {
        setError("Error al guardar respuesta.");
        return;
      }
      setRespuesta("");
      setEditandoId(null);
      if (esVendedor && vendedorId) {
        fetch(`/api/resenas/vendedor/${vendedorId}`)
          .then(res => res.json())
          .then(data => setResenas(data));
      }
    } catch {
      setError("Error de red.");
    }
  };

  const handleEliminarRespuesta = async (resenaId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar la respuesta?")) return;
    try {
      const res = await fetch(`/api/resenas/${resenaId}/respuesta`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Error al eliminar respuesta.");
        return;
      }
      if (esVendedor && vendedorId) {
        fetch(`/api/resenas/vendedor/${vendedorId}`)
          .then(res => res.json())
          .then(data => setResenas(data));
      }
    } catch {
      setError("Error de red.");
    }
  };

  // Cliente edita su reseña
  const handleEditarResena = (resena: Resena) => {
    setEditandoResena(resena);
    setModalModoEdicion(true);
    setShowModal(true);
  };

  // Cliente elimina su reseña
  const handleEliminarResena = async (resenaId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar tu reseña?")) return;
    try {
      const res = await fetch(`/api/resenas/${resenaId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Error al eliminar reseña.");
        return;
      }
      if (productoId) {
        fetch(`/api/resenas/producto/${productoId}`)
          .then(res => res.json())
          .then(data => setResenas(data));
        setPuedeResenar(true);
      }
    } catch {
      setError("Error de red.");
    }
  };

  // Cuando el cliente envía una reseña, recarga la lista
  const handleResenaEnviada = () => {
    if (productoId) {
      fetch(`/api/resenas/producto/${productoId}`)
        .then(res => res.json())
        .then(data => setResenas(data));
      setPuedeResenar(false);
    }
    setShowModal(false);
    setEditandoResena(null);
    setModalModoEdicion(false);
    if (typeof onResenaEnviada === "function") onResenaEnviada();
  };

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: "2rem", margin: "1rem 0" }}>
        {esVendedor ? "Reseñas de tus productos" : "Reseñas del producto"}
      </h2>
      {resenas.length === 0 && <p>No hay reseñas aún.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {resenas.map(resena => (
          <div
            key={resena.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px #0001",
              padding: "1.2rem 1.5rem",
              position: "relative",
              borderLeft: "6px solid #006633",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: 600, color: "#006633" }}>
                  Cliente {resena.cliente_id}
                </span>
                <span style={{ marginLeft: 12, color: "#ffb400", fontWeight: 700 }}>
                  {Array(resena.calificacion).fill("⭐").join("")}
                </span>
              </div>
              {/* Opciones de editar/eliminar solo para el cliente dueño */}
              {!esVendedor && resena.cliente_id === userId && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "#e0e0e0",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 10px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#bdbdbd")}
                    onMouseOut={e => (e.currentTarget.style.background = "#e0e0e0")}
                    onClick={() => handleEditarResena(resena)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={{
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 10px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#d32f2f")}
                    onMouseOut={e => (e.currentTarget.style.background = "#ff4d4f")}
                    onClick={() => handleEliminarResena(resena.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: "0.7rem", fontSize: "1.1rem" }}>
              {resena.comentario}
            </div>
            {/* Vendedor responde o edita respuesta */}
            {esVendedor && (
              resena.respuesta_vendedor ? (
                <div style={{ marginTop: "1rem", background: "#f6fff6", borderRadius: 6, padding: "0.7rem" }}>
                  <span style={{ color: "#006633", fontWeight: 600 }}>Respuesta:</span> {resena.respuesta_vendedor}
                  <div style={{ marginTop: 6 }}>
                    <button
                      style={{
                        background: "#e0e0e0",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        cursor: "pointer",
                        fontWeight: 500,
                        marginRight: 8,
                        transition: "background 0.2s",
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = "#bdbdbd")}
                      onMouseOut={e => (e.currentTarget.style.background = "#e0e0e0")}
                      onClick={() => setEditandoId(resena.id)}
                    >
                      Editar
                    </button>
                    <button
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        cursor: "pointer",
                        fontWeight: 500,
                        transition: "background 0.2s",
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = "#d32f2f")}
                      onMouseOut={e => (e.currentTarget.style.background = "#ff4d4f")}
                      onClick={() => handleEliminarRespuesta(resena.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                  {editandoId === resena.id && (
                    <form onSubmit={e => handleRespuesta(e, resena.id)} style={{ marginTop: 8 }}>
                      <input
                        type="text"
                        value={respuesta}
                        onChange={e => setRespuesta(e.target.value)}
                        style={{ padding: "4px", borderRadius: 4, border: "1px solid #ccc", width: "70%" }}
                      />
                      <button type="submit" style={{ marginLeft: 8, background: "#006633", color: "#fff", border: "none", borderRadius: 4, padding: "2px 10px" }}>Guardar</button>
                      <button type="button" style={{ marginLeft: 4, background: "#e0e0e0", border: "none", borderRadius: 4, padding: "2px 10px" }} onClick={() => setEditandoId(null)}>Cancelar</button>
                    </form>
                  )}
                </div>
              ) : (
                editandoId === resena.id ? (
                  <form onSubmit={e => handleRespuesta(e, resena.id)} style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      value={respuesta}
                      onChange={e => setRespuesta(e.target.value)}
                      placeholder="Responder..."
                      style={{ padding: "4px", borderRadius: 4, border: "1px solid #ccc", width: "70%" }}
                    />
                    <button type="submit" style={{ marginLeft: 8, background: "#006633", color: "#fff", border: "none", borderRadius: 4, padding: "2px 10px" }}>Enviar</button>
                    <button type="button" style={{ marginLeft: 4, background: "#e0e0e0", border: "none", borderRadius: 4, padding: "2px 10px" }} onClick={() => setEditandoId(null)}>Cancelar</button>
                  </form>
                ) : (
                  <button
                    style={{
                      background: "#006633",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 10px",
                      cursor: "pointer",
                      fontWeight: 500,
                      marginTop: 10,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#004d2c")}
                    onMouseOut={e => (e.currentTarget.style.background = "#006633")}
                    onClick={() => setEditandoId(resena.id)}
                  >
                    Responder
                  </button>
                )
              )
            )}
            {/* Si eres cliente, muestra la respuesta del vendedor si existe */}
            {!esVendedor && resena.respuesta_vendedor && (
              <div style={{ marginTop: "1rem", background: "#f6fff6", borderRadius: 6, padding: "0.7rem", color: "#006633" }}>
                <strong>Respuesta del vendedor:</strong> {resena.respuesta_vendedor}
              </div>
            )}
          </div>
        ))}
      </div>
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      {/* Solo cliente puede dejar reseña */}
      {!esVendedor && puedeResenar && (
        <>
          <button
            onClick={() => {
              setShowModal(true);
              setModalModoEdicion(false);
              setEditandoResena(null);
            }}
            style={{
              marginTop: "1.5rem",
              background: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "14px 40px",
              fontWeight: 700,
              fontSize: "1.2rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #0001",
              letterSpacing: "1px",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#219150";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#27ae60";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span role="img" aria-label="reseña" style={{ marginRight: 8 }}>📝</span>
            Dejar reseña
          </button>
        </>
      )}
      {/* Modal para crear o editar reseña */}
      {showModal && productoId && (
        <ModalResena
          productoId={productoId}
          onClose={() => {
            setShowModal(false);
            setEditandoResena(null);
            setModalModoEdicion(false);
          }}
          onResenaEnviada={handleResenaEnviada}
          resenaAEditar={
            modalModoEdicion && editandoResena
              ? {
                  id: editandoResena.id,
                  comentario: editandoResena.comentario,
                  calificacion: editandoResena.calificacion,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default ResenasPanel;