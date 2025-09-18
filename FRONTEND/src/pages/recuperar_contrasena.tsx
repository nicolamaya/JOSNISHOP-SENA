import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/recuperar.css";
import logo from "/public/logo.png";
import video from "../assets/IMG/inicio_video.mp4";

const RecuperarContrasena: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirige al login tras mostrar el mensaje
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  // Manejo del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Por favor ingresa un correo válido.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/usuarios/recuperar-contrasena",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Si el correo está registrado, recibirás la nueva contraseña en tu correo."
        );
      } else {
        setError(data.detail || "No se pudo recuperar la contraseña.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    }
    setLoading(false);
  };

  return (
    <div className="recovery-container">
      {/* Sección izquierda con video */}
      <div className="recovery-left" style={{ height: "100vh", minHeight: "100vh" }}>
        <div className="gallery" style={{ height: "100vh", minHeight: "100vh" }}>
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              objectPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              minHeight: "100vh",
            }}
          ></video>
        </div>
      </div>

      {/* Sección derecha con formulario */}
      <div className="recovery-right">
        <div className="recover-logo">
          <img src={logo} alt="Logo JOSNISHOP" />
        </div>

        <h1>Recuperar Contraseña</h1>

        <form id="recoveryForm" onSubmit={handleSubmit}>
          <p style={{ marginBottom: "18px", marginTop: "0" }}>
            Ingresa tu correo electrónico registrado para recibir la nueva contraseña.
          </p>
          <input
            type="email"
            id="recoveryEmail"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ marginBottom: "12px" }}
          />

          {error && <div className="error-message" style={{ marginBottom: "12px" }}>{error}</div>}

          <button
            type="submit"
            id="sendRecoveryBtn"
            disabled={loading}
            style={{ marginTop: "8px" }}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {message && (
          <div
            id="recoveryMessage"
            style={{
              color: "#1ebc7c",
              textAlign: "center",
              marginTop: "18px",
            }}
          >
            {message}
          </div>
        )}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <div style={{ background: '#fff9b1', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
            <span style={{ color: '#222', fontSize: '1.08rem' }}>
              <a
                href="/login"
                style={{ color: '#1ebc7c', textDecoration: 'underline', fontWeight: 500 }}
              >
                ← Volver al login
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;