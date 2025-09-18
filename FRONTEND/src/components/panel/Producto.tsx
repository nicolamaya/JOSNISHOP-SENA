import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../assets/css/panel.css";

// ===================
// Modelo Producto
// ===================
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
}

interface Categoria {
  id: number;
  nombre: string;
  estado: boolean;
  fecha_creacion: string;
}

// ===================
// Componente Productos
// ===================
const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState<number>(0);
  const [estado, setEstado] = useState(true);
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get<Producto[]>("http://localhost:8000/productos"),
          axios.get<Categoria[]>("http://localhost:8000/categorias")
        ]);
        setProductos(prodRes.data);
        setCategorias(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (producto?: Producto) => {
    if (producto) {
      setEditProducto(producto);
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setCategoriaId(producto.categoria_id);
    } else {
      setEditProducto(null);
      setNombre("");
      setDescripcion("");
      setCategoriaId(categorias[0]?.id || 0);
      setEstado(true);
    }
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const guardarProducto = async () => {
    try {
      if (editProducto) {
        const res = await axios.put<Producto>(
          `http://localhost:8000/productos/${editProducto.id}`,
          { nombre, descripcion, categoria_id: categoriaId, estado }
        );
        setProductos(
          productos.map((p) => (p.id === editProducto.id ? res.data : p))
        );
      } else {
        const res = await axios.post<Producto>(
          "http://localhost:8000/productos",
          { nombre, descripcion, categoria_id: categoriaId, estado }
        );
        setProductos([...productos, res.data]);
      }
      cerrarModal();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!window.confirm("¿Seguro quieres eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:8000/productos/${id}`);
      setProductos(productos.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Reporte de Productos", 14, 20);

    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);

    // Mensaje motivador
    doc.setFontSize(12);
    const mensaje = `Estimado administrador:

Este reporte contiene todos los productos registrados en la plataforma.
Gracias a su esfuerzo y dedicación, nuestra tienda sigue creciendo y ofreciendo lo mejor a nuestros clientes.
Recuerde que cada producto es una oportunidad para sorprender y satisfacer a quienes confían en nosotros.

¡Siga adelante, su trabajo es clave para el éxito de JosniShop!

Con aprecio,
El equipo de JosniShop`;

    const mensajeLines = doc.splitTextToSize(mensaje, 180);
    doc.text(mensajeLines, 14, 38);

    // Calcula la posición Y después del texto
    const yAfterMensaje = 38 + mensajeLines.length * 7 + 10;

    // Tabla de productos
    if (productosFiltrados.length === 0) {
      doc.setFontSize(12);
      doc.text("No hay productos para mostrar.", 14, yAfterMensaje);
    } else {
      const headers = [["ID", "Nombre", "Descripción", "Categoría"]];
      const rows = productosFiltrados.map(prod => {
        const categoria = categorias.find(c => c.id === prod.categoria_id);
        return [
          prod.id,
          prod.nombre,
          prod.descripcion,
          categoria?.nombre || "-"
        ];
      });
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: yAfterMensaje,
        styles: { halign: 'center' },
        headStyles: { fillColor: "#27ae60", textColor: "#fff" },
        margin: { top: 10 },
      });
    }

    doc.save("reporte_productos.pdf");
  };

  // Filtrar productos por nombre
  const productosFiltrados = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <p>Cargando productos...</p>;

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <h1 className="page-title">Productos</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button className="btn-add" onClick={() => abrirModal()}>Agregar Producto</button>
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
          disabled={productosFiltrados.length === 0}
        >
          Descargar PDF
        </button>
      </div>
      {/* Nuevo contenedor para el scroll vertical */}
      <div className="table-container">
        <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => {
                const categoria = categorias.find(c => c.id === prod.categoria_id);
                return (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.nombre}</td>
                    <td>{prod.descripcion}</td>
                    <td>{categoria?.nombre || "-"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => abrirModal(prod)}>Editar</button>
                      <br />
                      <br />
                      <button className="btn-delete" onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
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
            <h2>{editProducto ? "Editar Producto" : "Agregar Producto"}</h2>
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label>Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <label>Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <div className="modal-buttons">
              <button className="btn-save" onClick={guardarProducto}>Guardar</button>
              <button className="btn-delete" onClick={cerrarModal}>Cancelar</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Productos;