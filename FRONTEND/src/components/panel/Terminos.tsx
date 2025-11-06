import React from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TERMS_TEXT = `Términos y Condiciones de Uso de Josnishop
Fecha de última actualización: 31 de octubre de 2025

1. Aceptación de los Términos
Al registrarse y utilizar la plataforma Josnishop (en adelante, "la Plataforma"), usted (en adelante, el "Usuario") acepta estar sujeto a estos Términos y Condiciones de Uso, incluyendo las políticas de privacidad y de datos, así como todas las leyes y regulaciones aplicables. Si no está de acuerdo con estos términos, no debe utilizar la Plataforma.

2. Definiciones Clave
Plataforma: El sitio web y las aplicaciones móviles de Josnishop, diseñadas para la compra y venta de productos.
Cliente: Usuario que se registra para buscar, comprar productos y dejar reseñas.
Vendedor: Usuario que se registra para gestionar su inventario, publicar productos, recibir pedidos y responder a reseñas.
Contenido: Cualquier texto, imagen, video o dato publicado por un Usuario en la Plataforma.

3. Registro y Cuentas de Usuario
3.1. Obligatoriedad del Registro: Para acceder a las funciones de compra y venta, el Usuario debe completar un proceso de registro con un perfil único.
3.2. Roles y Datos: El registro es diferenciado para Clientes y Vendedores. * Clientes: Deben proporcionar un correo electrónico único y crear una contraseña segura. * Vendedores: Deben proporcionar datos verificables antes de ser autorizados a vender. Josnishop se reserva el derecho de utilizar servicios externos de verificación de identidad antes de la aprobación.
3.3. Seguridad de la Cuenta: * El Usuario es responsable de mantener la confidencialidad de su contraseña. * Los Vendedores deben contar con autenticación de dos factores para proteger su cuenta.

4. Uso de la Plataforma y Contenido
4.1. Inventario en Tiempo Real (Vendedores): Los Vendedores se comprometen a mantener su inventario actualizado en tiempo real para reflejar la disponibilidad precisa de los productos. Josnishop enviará alertas de stock bajo como medida de apoyo.
4.2. Publicación de Productos (Vendedores): * El Vendedor es responsable de la exactitud de la información de sus productos (nombre, descripción, precio y stock). * El Vendedor puede subir fotos y videos de hasta 60 segundos para describir los productos. * Se establecerán límites en el tamaño de los archivos subidos para la gestión de espacio de almacenamiento.
4.3. Reseñas y Calificaciones: * Solo los Clientes que hayan comprado un producto pueden dejar una reseña. * Tanto Clientes como Vendedores tienen derecho a responder a las reseñas para mejorar la reputación y atender inquietudes. * Las reseñas deben ser veraces y no deben contener lenguaje ofensivo o difamatorio.

5. Proceso de Compra y Pagos
5.1. Proceso de Compra: Josnishop se esfuerza por un proceso de compra ágil, permitiendo la compra con un solo clic si el Cliente ha guardado métodos de pago.
5.2. Métodos de Pago: La Plataforma acepta tarjetas de crédito, débito y pagos electrónicos.
5.3. Seguridad de Pagos: Todos los pagos se realizarán a través de pasarelas de pago externas y reconocidas (ej. PayU, MercadoPago, Stripe) que cumplan con las normas financieras para garantizar la seguridad y prevenir fraudes. Josnishop implementará mecanismos de seguridad antifraude.

6. Privacidad y Protección de Datos
6.1. Cumplimiento Legal: Josnishop se compromete a proteger los datos personales de sus Usuarios, en estricto cumplimiento de la Ley de Protección de Datos Personales en Colombia (Ley 1581 de 2012).
6.2. Cifrado: Los datos de los Usuarios estarán cifrados en el sistema.

7. Limitación de Responsabilidad y Disponibilidad
7.1. Disponibilidad: Josnishop procurará una disponibilidad mínima del 99% del tiempo. Sin embargo, no se garantiza el acceso ininterrumpido a la Plataforma debido a fallas técnicas, mantenimiento o causas de fuerza mayor.
7.2. Velocidad de Carga: Si bien Josnishop se compromete a que la plataforma cargue en menos de 3 segundos , no se hace responsable por la velocidad de conexión del Usuario.

8. Modificaciones de los Términos
Josnishop se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. El uso continuado de la Plataforma después de la publicación de las modificaciones constituye la aceptación de dichas modificaciones.
`;

const Terminos: React.FC = () => {
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;

    const finish = () => {
      // add page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
      }
      doc.save('terminos_y_condiciones_josnishop.pdf');
    };

    // Header + logo loader
    const drawContent = (yStart: number) => {
      doc.setFontSize(18);
      doc.setTextColor(5, 77, 37);
      doc.text('Términos y Condiciones de Uso de Josnishop', margin, yStart);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text('Fecha de última actualización: 31 de octubre de 2025', margin, yStart + 18);

      // body text, wrapped
      doc.setFontSize(11);
      doc.setTextColor(40);
      const lines = doc.splitTextToSize(TERMS_TEXT, contentWidth);
      let cursorY = yStart + 36;
      const lineHeight = 14;
      for (let i = 0; i < lines.length; i++) {
        if (cursorY + lineHeight > pageHeight - margin - 40) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += lineHeight;
      }
    };

    const img = new window.Image();
    img.src = '/logo.png';
    img.onload = () => {
      // draw logo at top-left
      try {
        doc.addImage(img, 'PNG', margin, 18, 48, 48);
      } catch (err) {
        // ignore image errors
      }
      drawContent(40);
      finish();
    };
    img.onerror = () => {
      drawContent(40);
      finish();
    };
  };

  return (
    <div>
      {/* Título grande y centrado */}
      <div style={{ background: '#fafad2', padding: '32px 0 16px 0', marginBottom: 24, borderRadius: 16, textAlign: 'center' }}>
        <h1 style={{ color: '#054d25', fontWeight: 700, fontSize: 40, margin: 0 }}>Términos y Condiciones</h1>
      </div>

      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Términos y Condiciones</h2>
            <p style={{ margin: '6px 0 0 0', color: '#666' }}>Lee detenidamente los términos que regulan el uso de Josnishop.</p>
          </div>
          <div>
            <button className="btn-save" onClick={downloadPdf}>Descargar PDF</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: '0 0 420px' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 3px 12px rgba(0,0,0,0.06)', lineHeight: 1.6, fontSize: 14 }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>Términos y Condiciones de Uso de Josnishop</strong>
              <small style={{ color: '#666' }}>Fecha de última actualización: 31 de octubre de 2025</small>
              <div style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{TERMS_TEXT}</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 18, minHeight: 320 }}>
              <h3 style={{ marginTop: 0 }}>Resumen y puntos clave</h3>
              <ul style={{ lineHeight: 1.7 }}>
                <li>Registro obligatorio, diferenciado para Clientes y Vendedores.</li>
                <li>Vendedores deben mantener inventario en tiempo real.</li>
                <li>Pagos a través de pasarelas externas seguras.</li>
                <li>Josnishop se reserva el derecho a modificar términos.</li>
              </ul>
              <p style={{ color: '#777' }}>Puedes descargar el documento completo en PDF usando el botón de arriba.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
