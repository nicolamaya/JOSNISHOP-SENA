import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../assets/css/panel.css";

// Modelo Categoría
export interface Categoria {
  id: number;
  nombre: string;
  estado: boolean;
  fecha_creacion: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get<Categoria[]>(
          "http://localhost:8000/categorias"
        );
        setCategorias(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const abrirModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditCategoria(categoria);
      setNombre(categoria.nombre);
      setEstado(categoria.estado);
    } else {
      setEditCategoria(null);
      setNombre("");
      setEstado(true);
    }
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const guardarCategoria = async () => {
    try {
      if (editCategoria) {
        const res = await axios.put<Categoria>(
          `http://localhost:8000/categorias/${editCategoria.id}`,
          { nombre, estado }
        );
        setCategorias(
          categorias.map((c) => (c.id === editCategoria.id ? res.data : c))
        );
      } else {
        const res = await axios.post<Categoria>(
          "http://localhost:8000/categorias",
          {
            nombre,
            estado,
          }
        );
        setCategorias([...categorias, res.data]);
      }
      cerrarModal();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarCategoria = async (id: number) => {
    if (!window.confirm("¿Seguro quieres eliminar esta categoría?")) return;
    try {
      await axios.delete(`http://localhost:8000/categorias/${id}`);
      setCategorias(categorias.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const descargarPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = '/logo.png';

    const title = 'Reporte de Categorías';
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();
    const mensaje = `Estimado administrador:\n\nEste reporte contiene todas las categorías registradas en la plataforma.\nGracias a su gestión y organización, nuestros productos pueden ser encontrados fácilmente por los clientes.\n\n¡Siga adelante, su trabajo es fundamental para el éxito de JosniShop!\n\nCon aprecio,\nEl equipo de JosniShop`;

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
      if (categoriasFiltradas.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay categorías para mostrar.', 40, startY);
      } else {
        const headers = [["ID", "Nombre", "Estado", "Fecha de creación"]];
        const rows = categoriasFiltradas.map((cat) => [cat.id, cat.nombre, cat.estado ? 'Activo' : 'Inactivo', new Date(cat.fecha_creacion).toLocaleString()]);
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

      doc.save('reporte_categorias.pdf');
    };

    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight);
      render();
    };
    img.onerror = () => { render(); };
  };

  // Filtrar categorías por nombre
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <p>Cargando categorías...</p>;

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h1 className="page-title">Categorías</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <button className="btn-add" onClick={() => abrirModal()}>
          Agregar Categoría
        </button>
        <input
          type="text"
          className="input-busqueda"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1.5px solid #27ae60",
            width: "220px",
          }}
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
            transition: "background 0.2s",
          }}
          disabled={categoriasFiltradas.length === 0}
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
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasFiltradas.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.nombre}</td>
                  <td>
                    <span
                      className={`status ${
                        cat.estado ? "active" : "inactive"
                      }`}
                    >
                      {cat.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit" onClick={() => abrirModal(cat)}>Editar</button>
                      <button className="btn-delete" onClick={() => eliminarCategoria(cat.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <motion.div
            className="modal"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2>
              {editCategoria ? "Editar Categoría" : "Agregar Categoría"}
            </h2>
            <label>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <label>Estado</label>
            <select
              value={estado ? "activo" : "inactivo"}
              onChange={(e) => setEstado(e.target.value === "activo")}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <div className="modal-buttons">
              <button className="btn-save" onClick={guardarCategoria}>
                Guardar
              </button>
              <button className="btn-delete" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Categorias;