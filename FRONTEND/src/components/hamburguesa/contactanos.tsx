import React, { useState } from "react";
import "../../assets/css/contactanos.css";
import { FaBars } from "react-icons/fa";
import "font-awesome/css/font-awesome.min.css";

const Contactanos: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

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
        <div className="menu-header-logo">
          <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div className="menu-search-container" style={{ position: 'relative' }}>
          <input type="text" placeholder="Buscar..." className="buscador-lateral" />
          <span className="icono-lupa-lateral">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        <ul className="menu-list">
          <li>
            <a href="/categorias" className="menu-link">
              <i className="fa-solid fa-grip"></i> Categorías
            </a>
          </li>
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
          <li>
            <a href="/inicio" className="menu-link">
              <i className="fa-solid fa-bag-shopping"></i> Mis pedidos
            </a>
          </li>
          <li>
            <a href="/carrito" className="menu-link">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </a>
          </li>
          <li>
            <a href="/panel" className="menu-link">
              <i className="fa-solid fa-user"></i> Mi cuenta
            </a>
          </li>
          <li>
            <a href="/login" className="menu-link">
              <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
            </a>
          </li>
        </ul>
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

      {/* Contenido principal de contacto */}
      <div className="grid-container">
        <main className="main-content">
          <div className="card">
            <section className="card-section">
              <br /><br /><br />
              <h2>Servicio al cliente</h2>
              <div className="contact-info">
                Tel: 000-000-000<br />
                Email: info@pixtrade.com
              </div>
              <hr /><br /><br />
              <h2>Distribuidores</h2><br />
              <ul className="distribuidores-list">
                <li>Distribuidora Calzado: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Ropa: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Bisutería: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Hogar: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Deportes: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Juegos: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Belleza: Carrera 0 sur # 0 - 0</li>
              </ul>
            </section>

            <section className="card-section contacto">
              <div className="contacto-header">
                <br /><br /><br /><br /><br />
                <h2>CONTÁCTANOS</h2>
                <p>PARA CUALQUIER CONSULTA</p>
              </div>
              {!enviado ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input type="text" placeholder="Nombre" aria-label="Nombre" required />
                    <input type="email" placeholder="Email" aria-label="Email" required />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Escribe tu mensaje aquí..." aria-label="Mensaje" required></textarea>
                  </div>
                  <button className="button" type="submit">Enviar</button>
                </form>
              ) : (
                <p className="enviado">Mensaje enviado</p>
              )}
            </section>
          </div>
        </main>

        {/* Footer general */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Atención al cliente</h4>
              <p>Atención al cliente<br />Encuesta de satisfacción</p>
            </div>
            <div className="footer-section">
              <h4>Guía de Compra</h4>
              <p>Crear una cuenta<br />Pago<br />Envío<br />Protección del comprador</p>
            </div>
            <div className="footer-section">
              <h4>Ayuda</h4>
              <p>Centro de ayuda y preguntas frecuentes<br />Centro de seguridad<br />Protección de compras<br />Asistencia</p>
            </div>
          </div>
          <div>
            ©2025<br />
            Términos de uso · Política de privacidad · Tus preferencias de privacidad · Gestión de anuncios
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contactanos;