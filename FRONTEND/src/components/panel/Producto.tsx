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
  const [precio, setPrecio] = useState<number | "">("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
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
          { nombre, descripcion, categoria_id: categoriaId, estado, precio }
        );
        setProductos(
          productos.map((p) => (p.id === editProducto.id ? res.data : p))
        );
      } else {
        // Enviar FormData a endpoint de subida
        const form = new FormData();
        form.append('nombre', nombre);
        form.append('descripcion', descripcion);
        form.append('categoria_id', String(categoriaId));
        if (precio !== "") form.append('precio', String(precio));
        if (imagenFile) form.append('imagen', imagenFile);
        if (videoFile) form.append('video', videoFile);
        const resUpload = await axios.post(
          "http://localhost:8000/upload/producto",
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        // Obtener el producto recien creado
        const newProd = await axios.get<Producto>(`http://localhost:8000/productos/${resUpload.data.producto_id}`);
        setProductos([...productos, newProd.data]);
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
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = '/logo.png';

    const title = 'Reporte de Productos';
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();
    const mensaje = `Estimado administrador:\n\nEste reporte contiene todos los productos registrados en la plataforma.\nGracias por su esfuerzo y dedicación.\n\n¡Siga adelante, su trabajo es clave para el éxito de JosniShop!\n\nCon aprecio,\nEl equipo de JosniShop`;

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
      if (productosFiltrados.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay productos para mostrar.', 40, startY);
      } else {
        const headers = [["ID", "Nombre", "Descripción", "Categoría"]];
        const rows = productosFiltrados.map(prod => {
          const categoria = categorias.find(c => c.id === prod.categoria_id);
          return [prod.id, prod.nombre, prod.descripcion, categoria?.nombre || "-"];
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

      doc.save('reporte_productos.pdf');
    };

    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight);
      render();
    };
    img.onerror = () => { render(); };
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
                      <div className="table-actions">
                        <button className="btn-edit" onClick={() => abrirModal(prod)}>Editar</button>
                        <button className="btn-delete" onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
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
            <h2>{editProducto ? "Editar Producto" : "Agregar Producto"}</h2>
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label>Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <label>Precio</label>
            <input value={precio} onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))} type="number" />
            <label>Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <label>Imagen (jpg/png)</label>
            <input type="file" accept="image/*" onChange={(e) => setImagenFile(e.target.files ? e.target.files[0] : null)} />
            <label>Video (opcional)</label>
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} />
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