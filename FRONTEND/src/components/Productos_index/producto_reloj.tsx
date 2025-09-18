import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css"; // Ajusta la ruta a tu CSS

const Productoreloj: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  const items = [
    "src/assets/IMG/index/carrusel1.png",
    "src/assets/IMG/index/carrusel2.png",
    "src/assets/IMG/index/carrusel3.png",
  ];

  // Función para cambiar de slide
  const goToSlide = (index: number) => {
    if (index < 0) index = items.length - 1;
    else if (index >= items.length) index = 0;

    setCurrentIndex(index);
    if (innerRef.current) {
      const itemWidth = innerRef.current.offsetWidth;
      innerRef.current.style.transform = `translateX(${-index * itemWidth}px)`;
    }
  };

  // Ajustar posición al redimensionar
  useEffect(() => {
    if (innerRef.current) {
      const itemWidth = innerRef.current.offsetWidth;
      innerRef.current.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
    }
  }, [currentIndex]);

  return (
    <div>
      {/* MENÚ SUPERIOR */}
      <header className="menu">
        <div className="hamburger">
          <i className="fa-solid fa-bars"></i>
        </div>

        <div className="logo">
          <img src="/logo.png" alt="Josnishop Logo" />
        </div>

        <a href="/categorias" className="categorias">Categorías</a>

        <div className="search-bar">
          <input type="text" placeholder="Buscar" />
          <i className="fa-solid fa-search"></i>
        </div>

        <nav className="nav-icons">
          <a href="/"><i className="fa-solid fa-house"></i></a>
          <a href="/inicio"><i className="fa-solid fa-bag-shopping"></i></a>
          <a href="/carrito"><i className="fa-solid fa-cart-shopping"></i></a>
          {(() => {
            const userName = localStorage.getItem("userName");
            const userId = localStorage.getItem("userId");
            if (userId) {
              return (
                <a href="/panel" className="user-session" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1b3a2b' }}>
                  <i className="fa-solid fa-user" style={{ fontSize: 22, marginRight: 6 }}></i>
                  <span style={{ fontSize: 16 }}>
                    {userName ? `Hola, ${userName}` : 'Mi cuenta'}
                  </span>
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
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="producto-container">
        <div className="producto-imagen">
          <img src="src/assets/IMG/index/reloj.png" alt="Fitness Tracker, Reloj de Actividad" />
        </div>

        <div className="producto-info">
          <h2>
           Reloj inteligente para monitorear actividad física
          </h2>
          <div className="precio">$69.990 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 5.0</div>
          <p className="detalle">Productos Disponibles: 100</p>
        </div>

        <div className="lateral">
          <p><strong>Vendido por:</strong> ShopID1389402 Store (Vendedor)</p>
          <p><strong>Envío:</strong> COP$5,327.72</p>
          <p><strong>Entrega:</strong> 12 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <label htmlFor="cantidad-reloj" style={{ margin: 0 }}>Cantidad:</label>
            <input
              type="number"
              id="cantidad-reloj"
              min={1}
              max={10}
              defaultValue={1}
              style={{ width: "50px", marginLeft: "5px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              className="comprar-btn"
              onClick={() => {
                // Validar si el usuario está logueado (por ejemplo, si hay un token en localStorage)
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Debes iniciar sesión para agregar productos al carrito.");
                  window.location.href = "/login";
                  return;
                }
                type ProductoCarrito = {
                  id: number;
                  nombre: string;
                  precio: number;
                  imagen: string;
                  cantidad: number;
                };
                const cantidad = parseInt((document.getElementById("cantidad-reloj") as HTMLInputElement).value) || 1;
                const producto: ProductoCarrito = {
                  id: 66, // <-- id numérico correcto
                  nombre: "Reloj inteligente",
                  precio: 69990,
                  imagen: "src/assets/IMG/index/reloj.png",
                  cantidad,
                };
                const carrito: ProductoCarrito[] = JSON.parse(localStorage.getItem("carrito") || "[]");
                const index = carrito.findIndex((p: ProductoCarrito) => p.id === producto.id);
                if (index >= 0) {
                  carrito[index].cantidad += cantidad;
                } else {
                  carrito.push(producto);
                }
                localStorage.setItem("carrito", JSON.stringify(carrito));
                alert(`¡${cantidad} producto(s) agregado(s) al carrito!`);
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      {/* VIDEOS */}
      {showVideos && (
        <div id="videosContainer" className="videos-container">
          <video controls>
            <source src="src/assets/videos/index/bolso/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
          <video controls>
            <source src="src/assets/videos/index/bolso/video2.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
          <video controls>
            <source src="src/assets/videos/index/bolso/video3.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        </div>
      )}

      {/* CARRUSEL */}
      <div className="carousel">
        <div className="carousel-inner" ref={innerRef}>
          {items.map((img, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentIndex ? "active" : ""}`}
            >
              <img src={img} alt={`Carrusel ${index + 1}`} />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          onClick={() => goToSlide(currentIndex - 1)}
        >
          <span>&lt;</span>
        </button>
        <button
          className="carousel-control-next"
          onClick={() => goToSlide(currentIndex + 1)}
        >
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default Productoreloj;
