import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import '../../assets/css/pedido.css';

interface Pedido {
  id_pedido: number;
  fecha_pedido: string;
  estado: string;
  total: number;
  cliente_id?: number;
}

function getPedidosUrl(userId: string | null) {
  // Solo el usuario con id 1 es vendedor y ve todos los pedidos
  if (userId === "1") {
    return "http://localhost:8000/pedidos/";
  }
  // Todos los demás (clientes) solo ven sus propios pedidos
  return `http://localhost:8000/pedidos/cliente/${userId}`;
}

interface PedidosProps {
  setSelectedPedidoId: (id: number | null) => void;
}

const Pedidos: React.FC<PedidosProps> = ({ setSelectedPedidoId }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Modal state for editing pedido status
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [nuevoEstadoModal, setNuevoEstadoModal] = useState<string>("Procesando");

  const userId = localStorage.getItem("userId");
  // El vendedor es solo el usuario con id 1
  // El resto son clientes
  // userRole ya no se usa para decidir la URL

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("No hay usuario en sesión");
      return;
    }

    setLoading(true);

    const url = getPedidosUrl(userId);

    axios
      .get<Pedido[]>(url)
      .then((res) => {
        setPedidos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar pedidos:", err);
        setError("Error al cargar pedidos. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });
  }, [userId]);

  const handleDelete = async (id: number) => {
    if (userId !== "1") return;
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await axios.delete(`http://localhost:8000/pedidos/${id}`);
      setPedidos(pedidos.filter((p) => p.id_pedido !== id));
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      setError("Error al eliminar pedido. Inténtalo de nuevo.");
    }
  };

  const abrirEditarEstado = (pedido: Pedido) => {
    setEditingPedido(pedido);
    setNuevoEstadoModal(pedido.estado);
  };

  const cerrarEditarEstado = () => {
    setEditingPedido(null);
  };

  const guardarEstado = async () => {
    if (!editingPedido) return;
    try {
      await axios.put(`http://localhost:8000/pedidos/${editingPedido.id_pedido}`, { estado: nuevoEstadoModal });
      setPedidos(prev => prev.map(p => p.id_pedido === editingPedido.id_pedido ? { ...p, estado: nuevoEstadoModal } : p));
      cerrarEditarEstado();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Mis Pedidos</h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Cargando pedidos...</div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                {userId === "1" && <th>Cliente ID</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td>{pedido.id_pedido}</td>
                  <td>{pedido.fecha_pedido}</td>
                  <td>
                    <span className={`status ${pedido.estado.toLowerCase()}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>${pedido.total.toFixed(2)}</td>
                  {userId === "1" && <td>{pedido.cliente_id}</td>}
                  <td>
                    <div className="table-actions">
                      {userId === "1" && (
                        <>
                          <button className="btn-delete" onClick={() => handleDelete(pedido.id_pedido)}>
                            Eliminar
                          </button>
                          <button className="btn-edit" onClick={() => abrirEditarEstado(pedido)}>
                            Editar estado
                          </button>
                        </>
                      )}
                      <button
                        className="btn-add"
                        onClick={() => setSelectedPedidoId(pedido.id_pedido)}
                      >
                        Ver detalle
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingPedido && (
        <div className="modal-overlay">
          <motion.div className="modal" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2>Editar estado del pedido #{editingPedido.id_pedido}</h2>
            <label>Estado</label>
            <select value={nuevoEstadoModal} onChange={e => setNuevoEstadoModal(e.target.value)}>
              <option value="Procesando">Procesando</option>
              <option value="En camino">En camino</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <div className="modal-buttons" style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <button className="btn-save" onClick={guardarEstado}>Guardar</button>
              <button className="btn-delete" onClick={cerrarEditarEstado}>Cancelar</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default Pedidos;