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
import axios from 'axios';
export function LoadFile() {
  const [studentsFile, setStudentsFile] = useState([]);
  const [collectionName, setCollectionName] = useState("");
// Función para convertir números de serie de Excel a fechas legibles
const excelDateToJSDate = (serial) => {
    const utcDays = serial - 25569; // Ajuste por fecha base de Excel
    const date = new Date(utcDays * 86400 * 1000); // Convertir a milisegundos
    return date.toLocaleDateString('es-ES'); // Puedes cambiar el formato según tus necesidades
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      // Procesar los datos para convertir fechas
      const processedData = worksheet.map(row => {
        // Suponiendo que 'fecha' es el nombre de la columna con fechas
        if (row.fechaExamen&&row.fechaEnvio) {
          // Convertir el número de serie de Excel a fecha legible
          row.fechaExamen = excelDateToJSDate(row.fechaExamen);
          row.fechaExamen = row.fechaExamen+1;
        row.fechaEnvio= excelDateToJSDate(row.fechaEnvio);
        row.fechaEnvio = row.fechaEnvio+1;
        }
        return row;
      });
  
      setStudentsFile(processedData);
    };
  
    reader.readAsArrayBuffer(file);
  };

    //const urlSaveStudentsFirebase='http://127.0.0.1:5001/demopp-fb74e/us-central1/saveStudents';

  //const urlSaveStudentsFirebase='http://localhost:5000/api/saveStudents';
  const urlSaveStudentsFirebase='https://api-sgca.vercel.app/api/saveStudents';
  const handleSaveToDatabase = async () => {
  const chunkSize = 500; // Tamaño del fragmento

  try {
    for (let i = 0; i < studentsFile.length; i += chunkSize) {
      const chunk = studentsFile.slice(i, i + chunkSize);
      await axios.post(urlSaveStudentsFirebase, { students: chunk, collectionName });
      
      
      console.log(`Fragmento ${i / chunkSize + 1} enviado con éxito`);
    }
    alert('Students saved to database');
  } catch (error) {
    console.error('Error saving students to database: ', error);
    alert('Failed to save students');
  }
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
         <Input
          type="text"
          value={collectionName}
          id="coleccion"
          className="mt-2"
          placeholder="Convocatoria-periodo formato CONV01-082024"
          maxLength={13}
          onChange={(e) => setCollectionName(e.target.value)}

        />
        <Button className="mt-4" onClick={handleSaveToDatabase} color="orange">
        Guardar en la base de datos
      </Button>
      </div>
     
    </div>
  );
}
export default LoadFile;
