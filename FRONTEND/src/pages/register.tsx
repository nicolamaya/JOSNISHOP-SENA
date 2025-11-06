import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // <-- Agrega esto
import "../assets/css/register.css";
import video from "../assets/IMG/inicio_video.mp4";

const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    // Validación de contraseña: mínimo 8 caracteres, una mayúscula, un número y un símbolo
    const validatePassword = (pwd: string) => {
      const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'".,<>\/\\?\\|`~]).{8,}$/;
      return re.test(pwd);
    };
    if (!validatePassword(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un símbolo."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Determinar el rol_id según la selección
    let rol_id = 1;
    if (formData.rol === "cliente") {
      rol_id = 2;
    }
    const res = await fetch("http://localhost:8000/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formData.nombre,
        correo: formData.email,
        contraseña: formData.password,
        rol_id: rol_id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Usuario registrado correctamente");
      setFormData({
        nombre: "",
        email: "",
        rol: "",
        password: "",
        confirmPassword: "",
      });
      // Mostrar alerta y luego redirigir
      alert("Registro exitoso");
      navigate("/login");
    } else {
      setError(data.detail || "Error al registrar usuario");
    }
  };

  return (
    <div className="registro-container">
      {/* Sección derecha: formulario */}
      <div className="registro-right">
        <div className="registro-logo">
          <img src="/logo.png" alt="Logo JOSNISHOP" />
        </div>
        <h1>Regístrate</h1>

        <form id="registerForm" onSubmit={handleRegister}>
          <label htmlFor="nombre">
            Nombre <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Tu nombre completo"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="registro-input-field"
          />

          <label htmlFor="email">
            Correo Electrónico <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ejemplo@correo.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="registro-input-field"
          />

          <label htmlFor="rol">
            Rol <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="rol"
            name="rol"
            required
            value={formData.rol}
            onChange={handleChange}
            className="registro-input-field"
          >
            <option value="" disabled>
              Selecciona tu rol
            </option>
            <option value="cliente">Cliente</option>
          </select>

          <label htmlFor="password">
            Contraseña <span style={{ color: "red" }}>*</span>
          </label>
          <div className="registro-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Crea una contraseña"
              required
              value={formData.password}
              onChange={handleChange}
              className="registro-input-field"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="registro-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={0}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label htmlFor="confirmPassword">
            Confirmar contraseña <span style={{ color: "red" }}>*</span>
          </label>
          <div className="registro-password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repite la contraseña"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="registro-input-field"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="registro-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={0}
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="registro-terms-container">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="acceptTerms">
              <span style={{ color: "red" }}>*</span> Acepto los{" "}
              <a
                href="#"
                className="registro-link-link"
                style={{
                  color: "#1ebc7c",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                Términos y Condiciones y Política de Privacidad
              </a>
            </label>
          </div>

          {error && <div className="registro-error-message">{error}</div>}
          {success && <div className="registro-success-message">{success}</div>}
          <br />
          <br />
          <p className="registro-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión.</Link>
          </p>

          <button type="submit" id="registerBtn">
            Continuar
          </button>
        </form>
      </div>

      {/* Sección izquierda: video */}
      <div className="registro-left">
        <div className="registro-gallery">
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="registro-video"
          ></video>
        </div>
      </div>

      {showModal && (
        <div className="registro-modal-overlay">
          <div className="registro-modal-content">
            <h2>Términos y Condiciones & Política de Privacidad</h2>
            <p>
              Bienvenido a JOSNISHOP. Al registrarte, aceptas que tus datos
              personales serán tratados conforme a la Ley de Protección de Datos
              Personales. Tus datos serán utilizados únicamente para gestionar tu
              cuenta, procesar pedidos y enviarte información relevante sobre
              nuestros productos y servicios.
            </p>
            <p>
              <strong>Política de privacidad:</strong> No compartiremos tu
              información con terceros sin tu consentimiento. Puedes solicitar la
              eliminación de tus datos en cualquier momento.
            </p>
            <p>
              <strong>Consentimiento informado:</strong> Al continuar, autorizas el
              tratamiento de tus datos para fines comerciales y administrativos de
              JOSNISHOP.
            </p>
            <button
              className="registro-close-modal"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro;