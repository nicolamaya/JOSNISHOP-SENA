import React, { useEffect, useState } from "react";
import axios from "axios";
// Iconos de lucide-react
import { CheckCircle, XCircle, Edit2, Save, X } from "lucide-react";
import '../../assets/css/Perfil.css';

// Interfaz que representa el usuario que devuelve el backend
interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: {
    id_rol: number;
    nombre: string;
  };
}

const Perfil: React.FC = () => {
  // Estado del usuario
  const [user, setUser] = useState<Usuario | null>(null);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado de edición (true = formulario editable)
  const [editMode, setEditMode] = useState(false);
  // Estado del formulario para actualizar datos
  const [form, setForm] = useState({ nombre: "", correo: "", contraseña: "" });
  // Estado para alertas (éxito o error)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // useEffect que carga los datos del usuario al montar el componente
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Se obtiene el ID guardado en localStorage (cuando hizo login)
    if (!userId) {
      console.error("No hay usuario logueado");
      setLoading(false);
      return;
    }

    // Petición al backend para obtener los datos del usuario
    axios
      .get<Usuario>(`http://localhost:8000/usuarios/${userId}`)
      .then((res) => {
        // Guardamos el usuario en el estado
        setUser(res.data);
        // Llenamos el formulario inicial con los datos recibidos
        setForm({
          nombre: res.data.nombre,
          correo: res.data.correo,
          contraseña: "", // La contraseña nunca se muestra
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        setLoading(false);
      });
  }, []);

  // Maneja cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja la actualización del perfil
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga
    try {
      // PUT al backend con los datos actualizados
      await axios.put(`http://localhost:8000/usuarios/${user?.id_usuario}`, form);

      // Salimos de modo edición
      setEditMode(false);
      // Mostramos alerta de éxito
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente.' });

      // Refrescamos los datos del usuario para mostrar lo más nuevo
      const res = await axios.get<Usuario>(`http://localhost:8000/usuarios/${user?.id_usuario}`);
      setUser(res.data);
    } catch {
      // Mostramos alerta de error si falla la actualización
      setAlert({ type: 'error', message: 'Error al actualizar usuario.' });
    }
  };

  // Maneja la desactivación de la cuenta
  const handleDeactivateAccount = async () => {
    if (!user) return;
    const first = window.confirm(
      "¿Estás seguro de que deseas desactivar tu cuenta? No podrás iniciar sesión hasta reactivarla."
    );
    if (!first) return;
    const second = window.confirm(
      "¡Atención!\n\nDesactivar tu cuenta la dejará inactiva, pero tus datos y pedidos se conservarán. ¿Realmente deseas continuar?"
    );
    if (!second) return;
    try {
      await axios.put(`http://localhost:8000/usuarios/${user.id_usuario}/desactivar`);
      localStorage.clear();
      setAlert({
        type: 'success',
        message: 'Cuenta desactivada correctamente. ¡Esperamos verte pronto de vuelta!',
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch {
      setAlert({ type: 'error', message: 'Error al desactivar la cuenta.' });
    }
  };

  // Vista
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        // Caso cargando
        <div className="perfil-card perfil-loading">
          <div className="perfil-spinner"></div>
          <span>Cargando perfil...</span>
        </div>
      ) : !user ? (
        // Caso no hay usuario
        <div className="perfil-card perfil-error">
          <XCircle color="#e53e3e" size={32} />
          <span>No se encontró información del usuario</span>
        </div>
      ) : (
        // Caso mostrar perfil
        <div className="perfil-card animate-fadein">
          {/* Bienvenida */}
          <h2 className="perfil-title" style={{textAlign:'center', marginBottom: '0.5rem'}}>
            ¡Bienvenido, <span style={{color:'#645853ff'}}>{user.nombre.split(' ')[0]}</span>!
          </h2>
          <p style={{textAlign:'center', color:'#888', marginBottom:'1.5rem', fontSize:'1.1rem'}}>
            Gestiona y personaliza tu información de usuario
          </p>

          {/* Alertas */}
          {alert && (
            <div className={`perfil-alert perfil-alert-${alert.type}`}> 
              {alert.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span>{alert.message}</span>
              <button className="perfil-alert-close" onClick={() => setAlert(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Modo vista */}
          {!editMode ? (
            <div className="perfil-info" style={{alignItems:'center'}}>
              {/* Avatar con inicial */}
              <div className="perfil-avatar perfil-avatar-xl">
                {user.nombre && (
                  <span>
                    {user.nombre
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
              {/* Datos */}
              <div className="perfil-datos perfil-datos-center">
                <p><span className="perfil-label">Nombre:</span> {user.nombre}</p>
                <p><span className="perfil-label">Correo:</span> {user.correo}</p>
              </div>
              {/* Botón editar */}
              <button className="perfil-btn-edit" onClick={() => setEditMode(true)}>
                <Edit2 size={18} /> Editar
              </button>
            </div>
          ) : (
            // Modo edición (formulario)
            <form className="perfil-form animate-fadein" onSubmit={handleUpdate}>
              <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={handleChange} required autoFocus />
              </label>
              <label>
                Correo
                <input name="correo" value={form.correo} onChange={handleChange} type="email" required />
              </label>
              <label>
                Nueva contraseña
                <input name="contraseña" value={form.contraseña} onChange={handleChange} type="password" placeholder="Nueva contraseña" />
              </label>
              {/* Botones de acción */}
              <div className="perfil-form-actions">
                <button className="perfil-btn-save" type="submit">
                  <Save size={18} /> Guardar
                </button>
                <button className="perfil-btn-cancel" type="button" onClick={() => setEditMode(false)}>
                  <X size={18} /> Cancelar
                </button>
              </div>
            </form>
          )}
          {/* Botón eliminar cuenta */}
          <div className="perfil-delete-account">
            <button
              className="perfil-btn-delete"
              style={{
                marginTop: "2rem",
                background: "#e53e3e",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem"
              }}
              onClick={handleDeactivateAccount}
            >
              Desactivar cuenta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
