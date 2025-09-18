import React, { useState, useEffect } from "react";
import {
  Home,
  Box,
  Package,
  ClipboardList,
  ShoppingCart,
  FileText,
  User,
  Star,
  LogOut,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../assets/css/panel.css";
import Categorias from "../components/panel/Categorias";
import Productos from "../components/panel/Producto";
import Inventario from "../components/panel/Inventario";
import Perfil from "../components/panel/Perfil";
import Pedidos from "../components/panel/Pedidos";
import Detalle from "../components/panel/detalle";
import ResenasPanel from "../components/panel/resenas";
import Ventas from "../components/panel/Ventas"; // Asegúrate de importar tu componente Ventas

// ===================
// Panel Principal
// ===================
const Panel: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productoId, setProductoId] = useState<number | null>(null);
  type ProductoComprado = {
    id: number;
    nombre: string;
    // agrega otros campos si los necesitas
  };

  const [productosComprados, setProductosComprados] = useState<ProductoComprado[]>([]);

  const userName = localStorage.getItem("userName") || "Usuario";
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase();
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }

  function getRoleLabel(role: string) {
    if (role === "vendedor") return "Vendedor";
    if (role === "cliente") return "Cliente";
    return "Usuario";
  }

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/resenas/comprados/${userId}`)
      .then(res => res.json())
      .then(data => setProductosComprados(data));
  }, [userId]);

  const renderContent = () => {
    if (selectedPedidoId) {
      return <Detalle pedidoId={selectedPedidoId} onBack={() => setSelectedPedidoId(null)} />;
    }
    switch (activePage) {
      case "dashboard":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="page-title">
              ¡Hola de nuevo, {userName.split(" ")[0]}!
            </h1>
            <p>
              ¡Bienvenido al Sistema de ventas online Josnishop!<br /><br />
              Nos llena de alegría tenerte aquí y queremos agradecerte sinceramente por confiar en nosotros. En Josnishop, trabajamos cada día para ofrecerte una experiencia única, sencilla y segura, donde puedas encontrar todo lo que necesitas para tu negocio o tus compras personales.<br /><br />
              Nuestro compromiso es acompañarte en cada paso, escuchando tus sugerencias y mejorando continuamente para que disfrutes de un servicio de calidad, rápido y confiable. Valoramos profundamente que nos hayas elegido entre tantas opciones, y por eso ponemos todo nuestro esfuerzo y dedicación en brindarte la mejor atención.<br /><br />
              Esperamos que disfrutes tu experiencia en Josnishop y que encuentres aquí un aliado para alcanzar tus metas. ¡Gracias por ser parte de nuestra comunidad!
            </p>
            <br />
            <br />
            <button
                style={{
                  padding: "20px 40px",
                  background: "#006633",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  
                }}
                onClick={() => navigate("/inicio")}
              >
                Ir al inicio
              </button>
              <br />
              <br /> 
              <br />
            <div className="video-container">
              <iframe
                width="640"
                height="360"
                src="https://www.youtube.com/embed/elueA2rofoo?si=XjRc_0AoI2ROCSFV"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            </div>
          </motion.div>
        );
      case "categorias":
        // Este componente debe tener el div.table-container dentro de su return
        return <Categorias />;
      case "productos":
        // Este componente debe tener el div.table-container dentro de su return
        return <Productos />;
      case "inventario":
        // Este componente debe tener el div.table-container dentro de su return
        return <Inventario />;
      case "pedidos":
        // Este componente debe tener el div.table-container dentro de su return
        return <Pedidos setSelectedPedidoId={setSelectedPedidoId} />;
      case "perfil":
        return <Perfil />;
      case "reseñas":
        if (userRole === "cliente") {
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="page-title">Reseñas</h1>
              <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
                <div style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px #0002",
                  padding: "1.5rem 2.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  minWidth: 340,
                  maxWidth: 420,
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: 28,
                    color: "#27ae60",
                    marginRight: 12
                  }}>
                    🛒
                  </span>
                  <select
                    onChange={e => setProductoId(Number(e.target.value))}
                    value={productoId || ""}
                    style={{
                      padding: "14px 24px",
                      borderRadius: "10px",
                      border: "2px solid #27ae60",
                      fontSize: "1.15rem",
                      background: "#f9f9f9",
                      color: "#17633a",
                      fontWeight: 600,
                      outline: "none",
                      minWidth: "220px",
                      boxShadow: "0 2px 8px #0001",
                      transition: "border 0.2s, box-shadow 0.2s"
                    }}
                    onFocus={e => (e.currentTarget.style.border = "2px solid #219150")}
                    onBlur={e => (e.currentTarget.style.border = "2px solid #27ae60")}
                  >
                    <option value="">Selecciona un producto para reseñar</option>
                    {productosComprados.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="table-container">
                {productoId && (
                  <ResenasPanel productoId={productoId} esVendedor={false} />
                )}
              </div>
            </motion.div>
          );
        }
        if (userRole === "vendedor") {
          // Mostrar TODAS las reseñas de todos los productos del vendedor
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="page-title">Reseñas de tus productos</h1>
              <div className="table-container">
                {/* Pasa el vendedorId (userId) y esVendedor=true */}
                <ResenasPanel vendedorId={Number(userId)} esVendedor={true} />
              </div>
            </motion.div>
          );
        }
        return <h1>No tienes acceso a reseñas</h1>;
      case "ventas":
        return <Ventas />; // Aquí irá tu componente Ventas.tsx
      default:
        return <h1 className="page-title">Selecciona una opción</h1>;
    }
  };

  return (
    <div className="layout">
      <button className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu size={24} color="#fff" />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar_panel ${isSidebarOpen ? "open" : ""}`}>
        <div className="user-card">
          <div className="user-avatar">{getInitials(userName)}</div>
          <div>
            <p className="user-name">{userName}</p>
            <p className="user-role">{getRoleLabel(userRole)}</p>
            <span className="status online">● En línea</span>
          </div>
        </div>

        <nav>
          <button
            className={`menu-item ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActivePage("dashboard");
              setSelectedPedidoId(null);
              setIsSidebarOpen(false);
            }}
          >
            <Home size={18} /> Dashboard
          </button>

          {userRole === "vendedor" && (
            <>
              <button
                className="menu-item"
                onClick={() => toggleMenu("productos")}
              >
                <Box size={18} /> Tus productos
              </button>
              {openMenu === "productos" && (
                <div className="submenu">
                  <button
                    onClick={() => {
                      setActivePage("categorias");
                      setSelectedPedidoId(null);
                      setIsSidebarOpen(false);
                    }}
                    className="submenu-item"
                  >
                    <ClipboardList size={16} /> Categorías
                  </button>
                  <button
                    onClick={() => {
                      setActivePage("productos");
                      setSelectedPedidoId(null);
                      setIsSidebarOpen(false);
                    }}
                    className="submenu-item"
                  >
                    <Package size={16} /> Mis productos
                  </button>
                  <button
                    onClick={() => {
                      setActivePage("inventario");
                      setSelectedPedidoId(null);
                      setIsSidebarOpen(false);
                    }}
                    className="submenu-item"
                  >
                    <FileText size={16} /> Inventario
                  </button>
                  {/* Nuevo botón para Ventas */}
                  <button
                    onClick={() => {
                      setActivePage("ventas");
                      setSelectedPedidoId(null);
                      setIsSidebarOpen(false);
                    }}
                    className="submenu-item"
                  >
                    <ShoppingCart size={16} style={{ color: "#27ae60" }} /> <span style={{ fontWeight: "bold" }}>Ventas</span>
                  </button>
                </div>
              )}
            </>
          )}

          <button className="menu-item" onClick={() => toggleMenu("pedidos")}>
            <ShoppingCart size={18} /> Tus pedidos
          </button>
          {openMenu === "pedidos" && (
            <div className="submenu">
              <button
                onClick={() => {
                  setActivePage("pedidos");
                  setSelectedPedidoId(null);
                  setIsSidebarOpen(false);
                }}
                className="submenu-item"
              >
                <ShoppingCart size={16} /> Mis pedidos
              </button>
            </div>
          )}

          <button className="menu-item" onClick={() => toggleMenu("cuenta")}>
            <User size={18} /> Mi cuenta
          </button>
          {openMenu === "cuenta" && (
            <div className="submenu">
              <button
                onClick={() => {
                  setActivePage("perfil");
                  setSelectedPedidoId(null);
                  setIsSidebarOpen(false);
                }}
                className="submenu-item"
              >
                <User size={16} /> Mi perfil
              </button>
            </div>
          )}

          {/* Botón Reseñas para vendedor y cliente */}
          {(userRole === "vendedor" || userRole === "cliente") && (
            <button
              onClick={() => {
                setActivePage("reseñas");
                setSelectedPedidoId(null);
                setIsSidebarOpen(false);
              }}
              className="menu-item"
            >
              <Star size={18} /> Reseñas
            </button>
          )}

          <p className="logout" onClick={handleLogout}>
            <LogOut size={18} /> Cerrar sesión
          </p>
        </nav>
      </aside>

      {/* Contenido central */}
      <main className="content">{renderContent()}</main>
    </div>
  );
};

export default Panel;