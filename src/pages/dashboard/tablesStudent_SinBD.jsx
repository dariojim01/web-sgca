import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Avatar,
} from "@material-tailwind/react";

export function TablesStudents() {
  const [students, setStudents] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      setStudents(worksheet);
    };

    reader.readAsArrayBuffer(file);
  };

  const generatePDF = (student) => {
    const doc = new jsPDF();

    // Cargar la imagen de plantilla
    const imageUrl = "/path/to/your/template.png"; // Actualiza esta ruta
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      // Añadir la imagen al PDF
      doc.addImage(image, "PNG", 0, 0, 210, 297); // Ajusta las coordenadas y tamaño según tus necesidades

      // Añadir texto sobre la imagen
      doc.setFontSize(16);
      doc.text(`Certificado para ${student.name}`, 10, 10);
      doc.text(`ID: ${student.id}`, 10, 20);
      doc.text(`Nombre: ${student.name}`, 10, 30);
      doc.text(`Email: ${student.email}`, 10, 40);
      doc.text(`Curso: ${student.course}`, 10, 50);

      // Guardar el PDF y crear un enlace de descarga
      const pdfUrl = doc.output("datauristring");
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Certificado_${student.name}.pdf`;
      link.click();
    };
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Typography variant="h6" className="mb-2">
          Cargar archivo Excel
        </Typography>
        <Input
          type="file"
          id="file-upload"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mt-2"
        />
      </div>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Lista de Estudiantes
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["ID", "Nombre", "Email", "Curso", "Acción"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, key) => {
                  const className = `py-3 px-5 ${
                    key === students.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={student.id}>
                      <td className={className}>{student.id}</td>
                      <td className={className}>{student.name}</td>
                      <td className={className}>{student.email}</td>
                      <td className={className}>{student.course}</td>
                      <td className="text-right">
                        <Button
                          color="blue"
                          size="sm"
                          onClick={() => generatePDF(student)}
                        >
                          Certificado PDF
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
export default TablesStudents;
