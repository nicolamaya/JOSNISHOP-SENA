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
                    {userId === "1" && (
                      <>
                        <button className="btn-delete" onClick={() => handleDelete(pedido.id_pedido)}>
                          Eliminar
                        </button>
                        <EditarEstadoPedidoButton pedido={pedido} setPedidos={setPedidos} />
                      </>
                    )}
                    <button
                      className="btn-add"
                      onClick={() => setSelectedPedidoId(pedido.id_pedido)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default Pedidos;

// Solo el vendedor puede editar el estado del pedido
interface EditarEstadoPedidoButtonProps {
  pedido: Pedido;
  setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
}

const EditarEstadoPedidoButton: React.FC<EditarEstadoPedidoButtonProps> = ({ pedido, setPedidos }) => {
  const [show, setShow] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(pedido.estado);
  const [loading, setLoading] = useState(false);

  const opciones = ["Procesando", "En camino", "Entregado", "Cancelado"];

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/pedidos/${pedido.id_pedido}`, { estado: nuevoEstado });
      setPedidos(prev => prev.map(p => p.id_pedido === pedido.id_pedido ? { ...p, estado: nuevoEstado } : p));
      setShow(false);
    } catch {
      alert("Error al actualizar estado");
    }
    setLoading(false);
  };

  return show ? (
    <span style={{ marginLeft: 8 }}>
      <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
        {opciones.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
      <button className="btn-save" onClick={handleUpdate} disabled={loading} style={{ marginLeft: 4 }}>
        Guardar
      </button>
      <button className="btn-cancel" onClick={() => setShow(false)} style={{ marginLeft: 4 }}>
        Cancelar
      </button>
    </span>
  ) : (
    <button className="btn-edit" style={{ marginLeft: 8 }} onClick={() => setShow(true)}>
      Editar estado
    </button>
  );
};