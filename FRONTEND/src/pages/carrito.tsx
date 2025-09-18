import React, { useEffect, useState } from "react";
import "../assets/css/carrito.css";
import { FaBars } from "react-icons/fa";
import "font-awesome/css/font-awesome.min.css";
import CryptoJS from "crypto-js";

type ProductoCarrito = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type MetodoPago = {
  nombre_tarjeta: string;
  numero_tarjeta: string;
  fecha_expiracion: string;
  cvv: string;
};

const SECRET_KEY = "Josnishop el mejor";

const Carrito: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editCantidad, setEditCantidad] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [correo, setCorreo] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    nombre: "",
    numero: "",
    fecha: "",
    cvv: "",
  });
  const [cardError, setCardError] = useState("");
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [showResumen, setShowResumen] = useState(false);
  const [usarGuardada, setUsarGuardada] = useState(false);
  const [tarjetaGuardada, setTarjetaGuardada] = useState<{
    nombre: string;
    numero: string;
    fecha: string;
    cvv: string;
  } | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const usuarioId = localStorage.getItem("userId");

  useEffect(() => {
    let carritoGuardado: ProductoCarrito[] = JSON.parse(
      localStorage.getItem("carrito") || "[]"
    );
    const nombreToId: Record<string, number> = {
      "Auriculares E6S": 61,
      "Auriculares Pro": 62,
      "Bolso de hombro para mujer": 63,
      "Cafetera": 64,
      "Lienzo Bastidor 12 X 18 Cm": 65,
      "Reloj inteligente": 66,
      "Set de cocina": 67,
      "Sofá moderno": 68,
      "Zapatillas deportivas": 69,
      "Consola de videojuegos": 70,
      "Perro de peluche": 71,
      "Cocina eléctrica": 72,
    };

    function getProductoId(p: ProductoCarrito) {
      if (typeof p.id === "number" && p.id > 0) return p.id;
      if (typeof p.id === "string" && nombreToId[p.nombre])
        return nombreToId[p.nombre];
      if (nombreToId[p.nombre]) return nombreToId[p.nombre];
      return 0;
    }

    carritoGuardado = carritoGuardado
      .map((p: ProductoCarrito) => ({
        ...p,
        id: getProductoId(p),
      }))
      .filter((p) => p.id > 0);

    setCarrito(carritoGuardado);
    localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "";
    const encrypted = localStorage.getItem(`tarjeta_${userId}`);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setTarjetaGuardada(decrypted);
      } catch {
        setTarjetaGuardada(null);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchMetodoPago() {
      if (!usuarioId) return;
      const res = await fetch(
        `http://localhost:8000/usuarios/${usuarioId}/metodo-pago`
      );
      if (res.ok) {
        const metodo = await res.json();
        setMetodoPago(metodo);
      }
    }
    fetchMetodoPago();
  }, [usuarioId]);

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  const handleEdit = (idx: number, cantidad: number) => {
    setEditIndex(idx);
    setEditCantidad(cantidad);
  };

  const handleSave = (idx: number) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[idx].cantidad = editCantidad;
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setEditIndex(null);
  };

  const handleDelete = (id: number) => {
    const nuevoCarrito = carrito.filter((p) => p.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setEditIndex(null);
  };

  const handleComprar = async () => {
    const cliente_id = Number(localStorage.getItem("userId"));
    if (!cliente_id || !correo || carrito.length === 0) {
      alert("Completa todos los datos y agrega productos al carrito.");
      return;
    }
    const detalles = carrito.map((p) => ({
      producto_id: p.id,
      cantidad: p.cantidad,
      subtotal: p.precio * p.cantidad,
    }));
    const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

    const pago = {
      id_usuario: cliente_id,
      nombre_tarjeta: tarjetaGuardada?.nombre,
      numero_tarjeta: tarjetaGuardada?.numero,
      fecha_expiracion: tarjetaGuardada?.fecha,
      cvv: tarjetaGuardada?.cvv,
    };

    try {
      await fetch("http://localhost:8000/pagos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pago),
      });

      const res = await fetch("http://localhost:8000/compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id,
          detalles,
          total,
          correo,
        }),
      });
      if (!res.ok) throw new Error("Error en la compra");
      alert("Compra realizada con éxito");
      setCarrito([]);
      localStorage.removeItem("carrito");
    } catch {
      alert("Error al realizar la compra");
    }
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, numero, fecha, cvv } = cardData;
    if (!nombre || !numero || !fecha || !cvv) {
      setCardError("Por favor completa todos los campos.");
      return;
    }
    setCardError("");
    const userId = localStorage.getItem("userId") || "";
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(cardData),
      SECRET_KEY
    ).toString();
    localStorage.setItem(`tarjeta_${userId}`, encrypted);
    setTarjetaGuardada(cardData);
    setShowCardForm(false);
    setUsarGuardada(true);
    setShowResumen(true);
  };

  const handleUsarGuardada = () => {
    setUsarGuardada(true);
    setShowResumen(true);
  };

  const handleCambiarMetodo = () => {
    setShowResumen(false);
    setShowCardForm(true);
    setUsarGuardada(false);
  };

  const pagar = async () => {
    const cliente_id = Number(localStorage.getItem("userId"));
    if (!metodoPago || carrito.length === 0 || !correo) {
      alert("Completa todos los datos y agrega productos al carrito.");
      return;
    }
    const detalles = carrito.map((p) => ({
      producto_id: p.id,
      cantidad: p.cantidad,
      subtotal: p.precio * p.cantidad,
    }));
    const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

    const pago = {
      id_usuario: cliente_id,
      nombre_tarjeta: metodoPago.nombre_tarjeta,
      numero_tarjeta: metodoPago.numero_tarjeta,
      fecha_expiracion: metodoPago.fecha_expiracion,
      cvv: metodoPago.cvv,
    };

    try {
      await fetch("http://localhost:8000/pagos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pago),
      });

      const res = await fetch("http://localhost:8000/compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id,
          detalles,
          total,
          correo,
        }),
      });
      if (!res.ok) throw new Error("Error en la compra");
      alert("Compra realizada con éxito");
      setCarrito([]);
      localStorage.removeItem("carrito");
    } catch {
      alert("Error al realizar la compra");
    }
  };

  return (
    <div>
      {/* MENÚ SUPERIOR */}
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
          <div className="buscador-container">
            <input type="text" placeholder="Buscar" className="buscador" />
            <span className="icono-lupa">
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
            <a href="/panel">
              <i className="fa-solid fa-user"></i>
            </a>
            <a href="/login" className="iniciar-sesion">
              Iniciar Sesión
            </a>
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
        <div
          className="menu-search-container menu-mobile-only"
          style={{ position: "relative" }}
        >
          <input
            type="text"
            placeholder="Buscar..."
            className="buscador-lateral"
          />
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

      {/* CONTENIDO PRINCIPAL */}
      <div className="container">
        <div className="carrito">
          <h2>Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            carrito.map((producto, idx) => (
              <div className="carrito-producto" key={producto.id}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  style={{ width: "100px" }}
                />
                <div className="carrito-info">
                  <h3>{producto.nombre}</h3>
                  <p className="carrito-precio">
                    $ {producto.precio.toLocaleString()} COP
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <label>Cantidad:</label>
                    {editIndex === idx ? (
                      <>
                        <input
                          type="number"
                          min={1}
                          value={editCantidad}
                          onChange={(e) =>
                            setEditCantidad(parseInt(e.target.value) || 1)
                          }
                          style={{ width: "50px" }}
                        />
                        <button
                          className="btn-guardar"
                          onClick={() => handleSave(idx)}
                          style={{ marginLeft: "300px" }}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn-cancelar"
                          onClick={() => setEditIndex(null)}
                          style={{ marginLeft: "35px" }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{producto.cantidad}</span>
                        <button
                          className="btn-editar"
                          onClick={() => handleEdit(idx, producto.cantidad)}
                          style={{ marginLeft: "300px" }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleDelete(producto.id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="resumen">
          <h3>Resumen</h3>
          <p>
            Total parcial:{" "}
            <span>
              ${" "}
              {carrito
                .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                .toLocaleString()}{" "}
              COP
            </span>
          </p>
          <p>
            Gastos de envío: <span>$0</span>
          </p>
          <p className="total">
            Total:{" "}
            <span>
              ${" "}
              {carrito
                .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                .toLocaleString()}{" "}
              COP
            </span>
          </p>
          {usarGuardada && tarjetaGuardada && (
            <div style={{ marginBottom: 8, color: "#2ecc40", fontWeight: "bold" }}>
              Usando método guardado: **** **** ****{" "}
              {tarjetaGuardada.numero?.slice(-4)}
            </div>
          )}
          {metodoPago ? (
            <>
              <div style={{ marginBottom: 8, color: "#2ecc40", fontWeight: "bold" }}>
                Usando método guardado: **** **** ****{" "}
                {metodoPago.numero_tarjeta?.slice(-4)}
              </div>
              <button
                className="btn-pagar"
                onClick={() => setShowModal(true)}
              >
                Comprar con 1 clic ({carrito.reduce((acc, p) => acc + p.cantidad, 0)})
              </button>
              <button
                className="btn-pagar"
                onClick={() => setShowCardForm(true)}
                style={{ marginLeft: 8 }}
              >
                Usar otro método
              </button>
            </>
          ) : (
            <button className="btn-pagar" onClick={() => setShowCardForm(true)}>
              Pagar ({carrito.reduce((acc, p) => acc + p.cantidad, 0)})
            </button>
          )}
          <div className="metodos">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
              alt="Visa"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
            />
          </div>
          <p className="extra">
            ✅ Obtenga un reembolso completo si el artículo no es como se describe o no se entrega
          </p>
          <div className="banner">
            Sigue observando sin límites
            <a href="/" className="btn-videos">
              Videos
            </a>
          </div>
        </div>
      </div>

      {showCardForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Datos de la tarjeta</h3>
            <form className="card-form" onSubmit={handleCardSubmit}>
              <label>
                Nombre en la tarjeta
                <input
                  type="text"
                  name="nombre"
                  value={cardData.nombre}
                  onChange={handleCardInput}
                  required
                />
              </label>
              <label>
                Número de tarjeta
                <input
                  type="text"
                  name="numero"
                  value={cardData.numero}
                  onChange={handleCardInput}
                  required
                  maxLength={16}
                  pattern="\d{16}"
                />
              </label>
              <label>
                Fecha de expiración
                <input
                  type="text"
                  name="fecha"
                  value={cardData.fecha}
                  onChange={handleCardInput}
                  required
                  placeholder="MM/AA"
                  maxLength={5}
                  pattern="\d{2}/\d{2}"
                />
              </label>
              <label>
                CVV
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleCardInput}
                  required
                  maxLength={4}
                  pattern="\d{3,4}"
                />
              </label>
              {cardError && <span className="card-error">{cardError}</span>}
              <div className="card-modal-btns">
                <button type="submit" className="btn-confirmar">
                  Continuar
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowCardForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
            <div className="card-icons">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                alt="Mastercard"
              />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {compraExitosa ? (
              <>
                <h3>¡Compra realizada con éxito!</h3>
                <p>Revisa tu correo para ver el número de pedido y detalles.</p>
                <button onClick={() => setCompraExitosa(false)}>Cerrar</button>
              </>
            ) : (
              <>
                <h3>Ingresa tu correo para confirmar la compra</h3>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
                <button onClick={pagar}>Confirmar compra</button>
                <button onClick={() => setShowModal(false)}>Cancelar</button>
              </>
            )}
          </div>
        </div>
      )}

      {showResumen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Resumen final de compra</h3>
            <p>
              <b>Total:</b> ${" "}
              {carrito
                .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                .toLocaleString()}{" "}
              COP
            </p>
            <p>
              <b>Método de pago:</b>{" "}
              {tarjetaGuardada
                ? `**** **** **** ${tarjetaGuardada.numero?.slice(-4)} (${
                    tarjetaGuardada.nombre
                  })`
                : "-"}
            </p>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="Correo para confirmación"
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleComprar} className="btn-confirmar">
                Finalizar compra
              </button>
              <button onClick={handleCambiarMetodo} className="btn-cancelar">
                Cambiar método
              </button>
              <button
                onClick={() => {
                  setShowResumen(false);
                  setUsarGuardada(false);
                }}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;