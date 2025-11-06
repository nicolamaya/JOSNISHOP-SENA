import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SalesReportModal from "./SalesReportModal";
import "../../assets/css/panel.css";

// ===================
// Modelo Inventario
// ===================
interface Inventario {
  id: number;
  producto_id: number;
  cantidad: number;
  stock_minimo: number;
  fecha_actualizacion: string;
}
// ===================
// Modelo Producto
// ===================
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
}

// ===================
// Componente Inventario
// ===================
const Inventario: React.FC = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [editInventario, setEditInventario] = useState<Inventario | null>(null);

  const [productoId, setProductoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [stockMinimo, setStockMinimo] = useState<number>(0);
  const [fecha_actualizacion, setFechaActualizacion] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, prodRes] = await Promise.all([
          axios.get<Inventario[]>("http://localhost:8000/inventarios"),
          axios.get<Producto[]>("http://localhost:8000/productos"),
        ]);
        setInventarios(invRes.data);
        setProductos(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (inv?: Inventario) => {
    if (inv) {
      setEditInventario(inv);
      setProductoId(inv.producto_id);
      setCantidad(inv.cantidad);
      setStockMinimo(inv.stock_minimo);
      setFechaActualizacion(inv.fecha_actualizacion.substring(0, 16));
    } else {
      setEditInventario(null);
      setProductoId(productos[0]?.id || 0);
      setCantidad(0);
      setStockMinimo(0);
      setFechaActualizacion("");
    }
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const guardarInventario = async () => {
    try {
      if (editInventario) {
        const res = await axios.put<Inventario>(
          `http://localhost:8000/inventarios/${editInventario.id}`,
          { producto_id: productoId, cantidad, stock_minimo: stockMinimo }
        );
        setInventarios(
          inventarios.map((i) => (i.id === editInventario.id ? res.data : i))
        );
      } else {
        const res = await axios.post<Inventario>(
          "http://localhost:8000/inventarios",
          { producto_id: productoId, cantidad, stock_minimo: stockMinimo }
        );
        setInventarios([...inventarios, res.data]);
      }
      cerrarModal();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarInventario = async (id: number) => {
    if (!window.confirm("¿Seguro quieres eliminar este registro de inventario?")) return;
    try {
      await axios.delete(`http://localhost:8000/inventarios/${id}`);
      setInventarios(inventarios.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const inventariosFiltrados = inventarios.filter((inv) => {
    const producto = productos.find((p) => p.id === inv.producto_id);
    return producto?.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  const descargarPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = '/logo.png';

    const title = 'Reporte de Inventario';
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();
    const mensaje = `Estimado encargado de inventario:\n\nEste reporte refleja el estado actual de los productos en su almacén.\nGracias por su dedicación y atención al detalle, pues su trabajo es fundamental para el éxito de nuestro equipo.\n\n¡Siga adelante, su esfuerzo marca la diferencia cada día!\n\nCon aprecio,\nEl equipo de JosniShop`;

    const render = () => {
      doc.setFontSize(20);
      doc.setTextColor('#1f618d');
      doc.text(title, 140, 50);
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(`Generado: ${generatedAtStr}`, 140, 68);

      const mensajeLines = doc.splitTextToSize(mensaje, pageWidth - 80);
      doc.setFontSize(11);
      doc.setTextColor('#222');
      doc.text(mensajeLines, 40, 100);

      const startY = 120 + mensajeLines.length * 12;
      if (inventariosFiltrados.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay datos de inventario para mostrar.', 40, startY);
      } else {
        const headers = [["ID", "Producto", "Cantidad", "Stock mínimo", "Última actualización"]];
        const rows = inventariosFiltrados.map(inv => {
          const producto = productos.find(p => p.id === inv.producto_id);
          return [inv.id, producto?.nombre || '-', inv.cantidad, inv.stock_minimo, new Date(inv.fecha_actualizacion).toLocaleString()];
        });
        autoTable(doc, {
          head: headers,
          body: rows,
          startY,
          styles: { fontSize: 10 },
          headStyles: { fillColor: '#27ae60', textColor: '#fff' },
          margin: { left: 40, right: 40 }
        });
      }

      doc.setFontSize(9);
      doc.setTextColor('#777');
      doc.text(`Última vista: ${generatedAtStr}`, 40, doc.internal.pageSize.getHeight() - 30);

      doc.save('reporte_inventario.pdf');
    };

    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight);
      render();
    };
    img.onerror = () => { render(); };
  };

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <h1 className="page-title">Inventario</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button className="btn-add" onClick={() => abrirModal()}>Agregar Inventario</button>
        <input
          type="text"
          className="input-busqueda"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: "8px", borderRadius: "8px", border: "1.5px solid #27ae60", width: "220px" }}
        />
        <button
          onClick={descargarPDF}
          style={{
            background: "#2980b9",
            color: "#fff",
            borderRadius: "8px",
            padding: "8px 18px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          disabled={inventariosFiltrados.length === 0}
        >
          Descargar PDF
        </button>
        <button
          onClick={() => setSalesModalOpen(true)}
          style={{
            background: "#16a085",
            color: "#fff",
            borderRadius: "8px",
            padding: "8px 18px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Ver reporte de ventas
        </button>
      </div>
      {/* Nuevo contenedor para el scroll vertical */}
      <div className="table-container">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Stock mínimo</th>
                <th>Última actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventariosFiltrados.map((inv) => {
                const producto = productos.find((p) => p.id === inv.producto_id);
                return (
                  <tr key={inv.id}>
                    <td>{inv.id}</td>
                    <td>{producto?.nombre || "-"}</td>
                    <td>{inv.cantidad}</td>
                    <td>{inv.stock_minimo}</td>
                    <td>{new Date(inv.fecha_actualizacion).toLocaleString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-edit" onClick={() => abrirModal(inv)}>Editar</button>
                        <button className="btn-delete" onClick={() => eliminarInventario(inv.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <motion.div className="modal" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2>{editInventario ? "Editar Inventario" : "Agregar Inventario"}</h2>
            <label>Producto</label>
            <select value={productoId} onChange={(e) => setProductoId(Number(e.target.value))}>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <label>Cantidad</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
            <label>Stock mínimo</label>
            <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(Number(e.target.value))} />
            <label>Fecha de actualización</label>
            <input
              type="datetime-local"
              value={fecha_actualizacion ? fecha_actualizacion.substring(0, 16) : ""}
              onChange={(e) => setFechaActualizacion(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn-save" onClick={guardarInventario}>Guardar</button>
              <button className="btn-delete" onClick={cerrarModal}>Cancelar</button>
            </div>
          </motion.div>
        </div>
      )}
      {salesModalOpen && (
        <SalesReportModal onClose={() => setSalesModalOpen(false)} />
      )}
    </motion.div>
  );
};

export default Inventario;