import React, { useEffect, useRef, useState } from "react";
import "../assets/css/inicio.css";
import "font-awesome/css/font-awesome.min.css";
import { FaBars } from "react-icons/fa";

const Inicio: React.FC = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState(""); // Nuevo estado

  const getItemWidth = () => {
    return itemsRef.current[0]?.offsetWidth || 0;
  };

  const goToSlide = (index: number) => {
    const totalItems = itemsRef.current.length;
    if (!innerRef.current) return;

    if (index < 0) index = totalItems - 1;
    else if (index >= totalItems) index = 0;

    setCurrentIndex(index);

    const translateX = -index * getItemWidth();
    innerRef.current.style.transform = `translateX(${translateX}px)`;
  };

  useEffect(() => {
    goToSlide(currentIndex);
  }, [currentIndex]);

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  // Productos en array para filtrar
  const productos = [
    // Nota: Se agregó la propiedad categoria a cada producto para permitir el filtrado por categoría
    {
      id: 1,
      nombre: "Reloj",
      precio: "$69.990 COP",
      categoria: "Tecnología",
      descripcion: "Fitness Tracker, Ip68 Reloj De Seguimiento De Actividad ...",
      img: "/src/assets/IMG/index/reloj.png",
      link: "/productoreloj",
    },
    {
      id: 2,
      nombre: "Cafetera",
      precio: "$57.990 COP",
      categoria: "Hogar",
      descripcion: "Máquina con Molinillo, Máquina de Espresso de 15 Bar con Varita de...",
      img: "/src/assets/IMG/index/cafetera.png",
      link: "/ProductoCafeteria",
    },
    {
      id: 3,
      nombre: "Bolso",
      precio: "$102.639 COP",
      categoria: "Moda",
      descripcion: "Bolso de hombro para mujer, bolso de gran capacidad, bolso cruzado con...",
      img: "/src/assets/IMG/index/bolso.png",
      link: "/productobolso",
    },
    {
      id: 4,
      nombre: "Perro",
      precio: "$19.779 COP",
      categoria: "Mascotas",
      descripcion: "Chubasquero con cara para perros, mono impermeable, Chaqueta...",
      img: "/src/assets/IMG/index/perro.png",
      link: "/ProductoPerro",
    },
    {
      id: 5,
      nombre: "Audífonos E6S",
      precio: "$19.699 COP",
      categoria: "Tecnología",
      descripcion: "Auriculares inalámbricos E6S con cancelación de ruido, auriculares...",
      img: "/src/assets/IMG/index/audifonos.png",
      link: "/ProductoAudifonosE6S",
    },
    ...(showMore
      ? [
          {
            id: 6,
            nombre: "Auriculares Pro",
            precio: "$49.900 COP",
            categoria: "Tecnología",
            descripcion: "Audífonos inalámbricos con cancelación de ruido y batería de larga duración...",
            img: "/src/assets/IMG/index/audifonos_deportivos.jpg",
            link: "/ProductoAuricularesPro",
          },
          {
            id: 7,
            nombre: "Set de pinturas",
            precio: "$29.990 COP",
            categoria: "Arte",
            descripcion: "Set de pintura acrílica profesional, ideal para artistas y principiantes...",
            img: "/src/assets/IMG/index/set.jpg",
            link: "/ProductoSet",
          },
          {
            id: 8,
            nombre: "Lienzo",
            precio: "$17.990 COP",
            categoria: "Arte",
            descripcion: "Lienzo Bastidor 12 X 18 Cm En Caballete En Madera 280g/m2...",
            img: "/src/assets/IMG/index/lienzo.jpg",
            link: "/ProductoLienzo",
          },
          {
            id: 9,
            nombre: "Sofá",
            precio: "$899.990 COP",
            categoria: "Hogar",
            descripcion: "Sofá moderno de 1 plaza, tapizado en tela beige, diseño elegante y cómodo...",
            img: "/src/assets/IMG/index/sofa.jpg",
            link: "/ProductoSofa",
          },
          {
            id: 10,
            nombre: "Utensilios de cocina",
            precio: "$30.990 COP",
            categoria: "Hogar",
            descripcion: "Set de utensilios de cocina de alta calidad, resistentes al calor y fáciles de limpiar.",
            img: "/src/assets/IMG/index/cocina.jpg",
            link: "/ProductoCocina",
          },
          {
            id: 11,
            nombre: "Consola PlayStation",
            precio: "$1.590.990 COP",
            categoria: "Tecnología",
            descripcion: "Consola PlayStation de última generación, gráficos avanzados y gran capacidad de almacenamiento.",
            img: "/src/assets/IMG/index/consola.jpg",
            link: "/ProductoPlay",
          },
          {
            id: 12,
            nombre: "Zapatillas deportivas",
            precio: "$300.000 COP",
            categoria: "Moda",
            descripcion: "Zapatillas deportivas cómodas y ligeras, ideales para correr y actividades al aire libre.",
            img: "/src/assets/IMG/index/zapatillas.jpg",
            link: "/ProductoZapatillas",
          },
        ]
      : []),
  ];

  // Estado para el tipo de filtro
  const [tipoFiltro, setTipoFiltro] = useState("nombre");

  // Filtrado según el tipo seleccionado
  const productosFiltrados = productos.filter(producto => {
    if (!busquedaActiva) return true;
    const valor = busquedaActiva.toLowerCase();
    if (tipoFiltro === "nombre") {
      return producto.nombre.toLowerCase().includes(valor);
    } else if (tipoFiltro === "precio") {
      return producto.precio.toLowerCase().includes(valor);
    } else if (tipoFiltro === "categoria") {
      return producto.categoria && producto.categoria.toLowerCase().includes(valor);
    }
    return false;
  });

  return (
    <div className="inicio-scroll">
      {/* MENÚ SUPERIOR (Navbar principal) */}
      <header>
        <div className="navbar">
          <button className="hamburger-btn" onClick={handleMenuOpen}>
            <FaBars />
          </button>
          <a href="/">
            <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          </a>
          <a href="/categorias" className="titulo">
            Categorías
          </a>
          <div className="buscador-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} style={{ height: '32px', borderRadius: '4px' }}>
              <option value="nombre">Nombre</option>
              <option value="precio">Precio</option>
              <option value="categoria">Categoría</option>
            </select>
            <input
              type="text"
              placeholder={`Buscar producto por ${tipoFiltro}...`}
              className="buscador"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") setBusquedaActiva(busqueda);
              }}
            />
            <span
              className="icono-lupa" 
              style={{ cursor: "pointer" }}
              onClick={() => setBusquedaActiva(busqueda)}
              title="Buscar"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
          <div className="iconos">
            <a href="/">
              <i className="fa-solid fa-house"></i>
            </a>
            <a href="/inicio">
              <i className="fa-solid fa-bag-shopping"></i>
            </a>
            <a href="/carrito">
              <i className="fa-solid fa-cart-shopping"></i>
            </a>
            {(() => {
              const userName = localStorage.getItem("userName");
              const userId = localStorage.getItem("userId");
              if (userId) {
                return (
                  <a href="/panel" className="user-session" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1b3a2b', marginLeft: 8 }}>
                    <i className="fa-solid fa-user" style={{ fontSize: 22, marginRight: 6 }}></i>
                    <span style={{ fontSize: 16 }}>{userName ? `Hola, ${userName}` : 'Mi cuenta'}</span>
                  </a>
                );
              } else {
                return (
                  <a href="/login" className="iniciar-sesion">
                    <i className="fa-solid fa-user" style={{ marginRight: 6 }}></i>
                    Iniciar Sesión
                  </a>
                );
              }
            })()}
          </div>
        </div>
      </header>

      {/* Menú hamburguesa lateral */}
      <nav className={`hamburger-menu${menuOpen ? " active" : ""}`}>
        <button className="close-btn" onClick={handleMenuClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Contenido visible solo en móvil */}
        <div className="menu-header-logo menu-mobile-only">
          <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div className="menu-search-container menu-mobile-only" style={{ position: 'relative' }}>
          <input type="text" placeholder="Buscar..." className="buscador-lateral" />
          <span className="icono-lupa-lateral">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        {/* Lista de enlaces */}
        <ul className="menu-list">
          <li>
            <a href="/" className="menu-link menu-inicio">
              <i className="fa-solid fa-home"></i> Inicio
            </a>
          </li>
          <li>
            <a href="/nosotros" className="menu-link">
              <i className="fa-solid fa-users"></i> ¿Quiénes somos?
            </a>
          </li>
          <li>
            <a href="/noticias" className="menu-link">
              <i className="fa-solid fa-newspaper"></i> Noticias
            </a>
          </li>
          <li>
            <a href="/contactanos" className="menu-link">
              <i className="fa-solid fa-envelope"></i> Contáctanos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/inicio" className="menu-link">
              <i className="fa-solid fa-bag-shopping"></i> Mis pedidos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/carrito" className="menu-link">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/panel" className="menu-link">
              <i className="fa-solid fa-user"></i> Mi cuenta
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/login" className="menu-link">
              <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
            </a>
          </li>
        </ul>

        {/* Footer del menú lateral (solo para móvil) */}
        <footer className="menu-footer">
          <div className="footer-columns">
            <div>
              <span className="footer-title">Atención al cliente</span>
              <ul>
                <li>Atención al cliente</li>
                <li>Encuesta de satisfacción</li>
              </ul>
            </div>
            <div>
              <span className="footer-title">Guía de Compra</span>
              <ul>
                <li>Crear una cuenta</li>
                <li>Pago</li>
                <li>Envío</li>
                <li>Protección del comprador</li>
              </ul>
            </div>
            <div>
              <span className="footer-title">Ayuda</span>
              <ul>
                <li>Centro de ayuda y preguntas frecuentes</li>
                <li>Centro de seguridad</li>
                <li>Protección de compras</li>
                <li>Adócate</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>©2025</span>
            <ul>
              <li>Términos de uso</li>
              <li>Política de privacidad</li>
              <li>Tus preferencias de privacidad</li>
              <li>Gestión de anuncios</li>
            </ul>
          </div>
        </footer>
      </nav>

      {/* CARRUSEL */}
      <div className="carousel">
        <div className="carousel-inner" ref={innerRef}>
          {["/src/assets/IMG/index/carrusel1.png", "/src/assets/IMG/index/carrusel2.png", "/src/assets/IMG/index/carrusel3.png"].map((src, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""}`}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
            >
              <img src={src} alt={`Carrusel ${i + 1}`} />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          onClick={() => goToSlide(currentIndex - 1)}
        >
          <span>&lt;</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={() => goToSlide(currentIndex + 1)}
        >
          <span>&gt;</span>
        </button>
      </div>

      {/* PRODUCTOS */}
      <section className="productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(producto => (
            <div className="inicio-producto" key={producto.id}>
              <a href={producto.link} className="btn">
                <img src={producto.img} alt={producto.nombre} />
              </a>
              <p className="precio">{producto.precio}</p>
              <p>{producto.descripcion}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
        {showMore && productosFiltrados.length > 0 && (
          <div style={{ width: "650%", marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <button className="btn-cerrar-extra" onClick={() => setShowMore(false)}>
              Cerrar productos extra
            </button>
          </div>
        )}
      </section>

      {/* Botón Ver más productos */}
      <div className="ver-mas-container">
        {!showMore && (
          <a href="#" className="btn" onClick={(e) => { e.preventDefault(); setShowMore(true); }}>
            <button className="btn-vermas">Ver más productos</button>
          </a>
        )}
      </div>

      {/* Botón flotante del chat */}
      <div className="chat-btn">
        <a>
          <i className="fa-solid fa-comment"></i>
        </a>
      </div>
    </div>
  );
};

export default Inicio;