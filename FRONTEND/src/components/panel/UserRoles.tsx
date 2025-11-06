import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Usuario = {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol_id: number;
  estado: number;
};

type Rol = { id_rol: number; nombre: string };

const getRoleName = (roleId: number | undefined): string => {
  switch (roleId) {
    case 1:
      return 'Vendedor';
    case 2:
      return 'Cliente';
    default:
      return 'Sin rol';
  }
};

const getRoleBadgeClass = (roleId: number | undefined): string => {
  switch (roleId) {
    case 1:
      return 'vendedor';
    case 2:
      return 'cliente';
    default:
      return 'no-role';
  }
};

const UserRoles: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);

  const load = async () => {
    try {
      const u = await axios.get<Usuario[]>("http://localhost:8000/usuarios");
      // Asegurémonos de que el estado se maneje como número exactamente como viene de la BD
      const usersWithFixedState = u.data.map(user => ({
        ...user,
        estado: user.estado
      }));
      setUsers(usersWithFixedState);
    } catch (err) {
      console.error(err);
      alert("Error cargando usuarios");
    }
  };

  useEffect(() => { load(); }, []);

  const handleChangeRole = async (userId: number, rolId: number) => {
    // open confirm modal for role change
    setPendingChange({ userId, rolId });
  };

  const [pendingChange, setPendingChange] = useState<{ userId: number; rolId: number } | null>(null);

  const confirmChange = async () => {
    if (!pendingChange) return;
    try {
      await axios.put(`http://localhost:8000/usuarios/${pendingChange.userId}`, {
        rol_id: pendingChange.rolId
      });
      setPendingChange(null);
      load();
    } catch (err) {
      console.error(err);
      alert('Error actualizando rol');
    }
  };

  const cancelChange = () => setPendingChange(null);

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();
    const title = 'Reporte de Usuarios';
    const mensaje = `Estimado administrador:\n\nAdjunto encontrará la lista de usuarios registrados en JosniShop con sus roles y estado actual. Use este reporte para tareas de auditoría, control y gestión de usuarios.\n\nGracias por mantener la plataforma segura y organizada.`;

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
      if (users.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay usuarios para mostrar.', 40, startY);
      } else {
        const headers = [["ID", "Nombre", "Correo", "Rol", "Estado"]];
        const rows = users.map(u => [u.id_usuario, u.nombre, u.correo, getRoleName(u.rol_id), u.estado ? 'Activo' : 'Inactivo']);
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

      doc.save('reporte_usuarios.pdf');
    };

    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      try { doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight); } catch (err) { console.warn('Logo add failed', err); }
      render();
    };
    img.onerror = () => { render(); };
  };

  return (
    <div>
      {/* Título centrado como Categorías */}
      <div style={{ background: '#fafad2', padding: '32px 0 16px 0', marginBottom: 24, borderRadius: 16, textAlign: 'center' }}>
        <h1 style={{ color: '#054d25', fontWeight: 700, fontSize: 40, margin: 0 }}>Usuarios</h1>
      </div>
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Lista de usuarios</h2>
            <p style={{ margin: '6px 0 0 0', color: '#666' }}>Solo vendedores pueden ver y cambiar roles</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-save" onClick={downloadPdf}>Descargar PDF</button>
          </div>
        </div>
        <div className="table-container">
          <div style={{ padding: 8 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(u.rol_id)}`}>
                        {getRoleName(u.rol_id)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.estado === 1 || u.estado === true ? 'active' : 'inactive'}`}>
                        {(u.estado === 1 || u.estado === true) ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="form-input" 
                        value={u.rol_id || ''} 
                        onChange={e => handleChangeRole(u.id_usuario, Number(e.target.value))}
                        style={{ minWidth: '120px' }}
                      >
                        <option value="">Seleccionar rol</option>
                        <option value="1">Vendedor</option>
                        <option value="2">Cliente</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {pendingChange && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar cambio de rol</h2>
            <p>¿Deseas cambiar el rol de este usuario?</p>
            <div className="modal-buttons">
              <button className="btn-save" onClick={confirmChange}>Confirmar</button>
              <button className="btn-delete" onClick={cancelChange}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
