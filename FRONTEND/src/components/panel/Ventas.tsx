import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define los posibles tipos de respuesta del backend
type VentaAnual = { Anio: number; TotalVentasAnuales: number };
type VentaTotalAnual = { TotalVentasAnuales: number };
type VentaMensual = { TotalVentasMensuales: number };
type VentaDiaria = { TotalVentasDiarias: number };
type VentaResponse = VentaAnual | VentaTotalAnual | VentaMensual | VentaDiaria;

type QueryType = 'anio' | 'mes' | 'dia';

const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<VentaResponse[]>([]);
  const [type, setType] = useState<QueryType>("anio");
  const [anio, setAnio] = useState<number>(2025);
  const [mes, setMes] = useState<number | null>(null);
  const [dia, setDia] = useState<number | null>(null);

  const consultarVentas = async () => {
    try {
      const params = [
        anio,
        type !== "anio" ? mes : null,
        type === "dia" ? dia : null
      ];
      const url = `http://localhost:8000/ventas?anio=${params[0]}${params[1] ? `&mes=${params[1]}` : ""}${params[2] ? `&dia=${params[2]}` : ""}`;
      const res = await axios.get<VentaResponse[]>(url);
      setVentas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const descargarPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
      const img = new Image();
      img.src = '/logo.png';
      const title = 'Reporte de Ventas';
      const generatedAt = new Date();
      const generatedAtStr = generatedAt.toLocaleString();

      const mensaje = "Estimado vendedor:\n" +
        "Este reporte refleja hasta el día de hoy todas sus ventas registradas en nuestra plataforma.\n" +
        "Queremos felicitarle y agradecerle sinceramente por su dedicación, esfuerzo y compromiso diario.\n" +
        "Cada venta representa no solo un logro comercial, sino también el resultado de su pasión, constancia y trabajo en equipo.\n\n" +
        "Gracias por confiar en nosotros y por ser parte fundamental de nuestra familia.\n" +
        "Recuerde que cada meta alcanzada es un paso más hacia sus sueños y que juntos seguiremos creciendo y superando nuevos retos.\n\n" +
        "¡Siga adelante, su éxito es nuestro orgullo!\n\n" +
        "Con aprecio,\n" +
        "El equipo de JosniShop";

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
      if (ventas.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay datos para mostrar.', 40, startY);
      } else {
        const headers = [Object.keys(ventas[0])];
        const rows = ventas.map(v => Object.values(v));
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

      doc.save('reporte_ventas.pdf');
    };

    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight);
      render();
    };
    img.onerror = () => {
      render();
    };
  };

  // Detecta el campo correcto según el tipo de consulta
  let labels: string[] = [];
  let dataVentas: number[] = [];

  if (ventas.length > 0) {
    const v = ventas[0] as VentaResponse;
    if (type === "anio" && "Anio" in v) {
      // Agrupado por año
      labels = ventas.map(vv => (vv as VentaAnual).Anio.toString());
      dataVentas = ventas.map(vv => (vv as VentaAnual).TotalVentasAnuales ?? 0);
    } else if (type === "anio" && "TotalVentasAnuales" in v) {
      // Solo total anual
      labels = ["Total Anual"];
      dataVentas = [(v as VentaTotalAnual).TotalVentasAnuales ?? 0];
    } else if (type === "mes" && "TotalVentasMensuales" in v) {
      labels = ["Total Mensual"];
      dataVentas = [(v as VentaMensual).TotalVentasMensuales ?? 0];
    } else if (type === "dia" && "TotalVentasDiarias" in v) {
      labels = ["Total Diario"];
      dataVentas = [(v as VentaDiaria).TotalVentasDiarias ?? 0];
    }
  }

  const chartVentas = {
    labels,
    datasets: [
      {
        label: "Ventas",
        data: dataVentas,
        backgroundColor: "#27ae60",
      },
    ],
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #b2bec3",
    outline: "none",
    fontSize: "1rem",
    background: "#f9f9f9",
    marginRight: "0.5rem",
    minWidth: "80px"
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    minWidth: "110px"
  };

  const buttonStyle: React.CSSProperties = {
    background: "#27ae60",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 18px",
    border: "none",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const pdfButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "#2980b9",
    marginBottom: "1rem"
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="page-title">Ventas</h1>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <select
          value={type}
          onChange={e => setType(e.target.value as QueryType)}
          style={selectStyle}
        >
          <option value="anio">Por año</option>
          <option value="mes">Por mes</option>
          <option value="dia">Por día</option>
        </select>
        <input
          type="number"
          value={anio}
          onChange={e => setAnio(Number(e.target.value))}
          placeholder="Año"
          style={inputStyle}
        />
        {type !== "anio" && (
          <input
            type="number"
            value={mes ?? ""}
            onChange={e => setMes(Number(e.target.value))}
            placeholder="Mes"
            min={1}
            max={12}
            style={inputStyle}
          />
        )}
        {type === "dia" && (
          <input
            type="number"
            value={dia ?? ""}
            onChange={e => setDia(Number(e.target.value))}
            placeholder="Día"
            min={1}
            max={31}
            style={inputStyle}
          />
        )}
        <button onClick={consultarVentas} style={buttonStyle}>
          Consultar
        </button>
      </div>
      <button
        onClick={descargarPDF}
        style={pdfButtonStyle}
        disabled={ventas.length === 0}
      >
        Descargar PDF
      </button>
      <div style={{
        marginTop: "2rem",
        background: "#f6fff6",
        borderRadius: "16px",
        boxShadow: "0 2px 12px #0001",
        padding: "2rem",
        textAlign: "center"
      }}>
        <Bar data={chartVentas} options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: "Gráfico de Ventas" }
          }
        }} />
      </div>
    </div>
  );
};

export default Ventas;