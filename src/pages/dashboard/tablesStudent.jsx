import React, { useEffect, useState } from "react";
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
  Select,
  Option,
} from "@material-tailwind/react";
import axios from 'axios';
import imgPDF from '../../../public/img/1.jpg'
import QRCode from 'qrcode';
export function TablesStudents() {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 30;
  const [collectionName, setCollectionName] = useState('');
  const [collections, setCollections] = useState([]);
  const [ cedula, setCedula] = useState('');

 //const urlGetStudentsFirebase = 'http://127.0.0.1:5001/demopp-fb74e/us-central1/getStudents'
 //const urlGetStudentsFirebase = 'http://localhost:5000/api/getStudents'
  const urlGetStudentsFirebase = 'https://api-sgca.vercel.app/api/getStudents'
 const getStudents = async (collectionName) => {
      try {
        
        
        //const response = await axios.get(`http://localhost:5000/api/getStudents`, {
          const response = await axios.get(urlGetStudentsFirebase,{ 
          params: { collectionName: collectionName },
        });
        setStudents(response.data);
        setFilteredStudents(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error('Error getting students: ', error);
      }
    };

     //const urlGetCollectionsFirebase = 'http://127.0.0.1:5001/demopp-fb74e/us-central1/getCollections'
     //const urlGetCollectionsFirebase = 'http://localhost:5000/api/getCollections'
     const urlGetCollectionsFirebase = 'https://api-sgca.vercel.app/api/getCollections'
     
 
     const getCollections = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/api/getCollections');
        const response = await axios.get(urlGetCollectionsFirebase);
        
        setCollections(response.data);
        setCollectionName(response.data[0]); // Establecer la primera colección como predeterminada
        getStudents(response.data[0]); // Obtener estudiantes de la primera colección
      } catch (error) {
        console.error('Error getting collections: ', error);
      }
    };
  
    const handleCollectionChange = (event) => {
      const selectedCollection = event.target.value;
      setCollectionName(selectedCollection);
      getStudents(selectedCollection);
    };

  const obtenerFechaEnEspañol = () => {
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaEnEspañol = fecha.toLocaleDateString('es-ES', opciones);
    return fechaEnEspañol;
  };
  const generatePDFDownload = (student) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const date = student.fechaEnvio;
    // Cargar la imagen de plantilla
    const imageUrl = imgPDF; // Actualiza esta ruta
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      // Añadir la imagen al PDF
     // doc.addImage(image, "JPG", 0, 0, 210, 297); // Ajusta las coordenadas y tamaño según tus necesidades
      doc.addImage(image, "JPG", 0, 0, 297, 210);
      // Añadir texto sobre la imagen
      doc.setFontSize(17);
          doc.text( student.nombre, 120, 110);
          doc.text( student.fechaExamen, 115, 130);
          doc.text(student.nivel, 195, 130);
          doc.text(date, 224, 154);

      // Guardar el PDF y crear un enlace de descarga
      const pdfUrl = doc.output("datauristring");
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Certificado_${student.nombre}.pdf`;
      link.click();
    };
  };

  const generatePDF = (student) => {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF({ orientation: "landscape" });
      const date1 = obtenerFechaEnEspañol();
      const imageUrl = "/img/1.jpg"; // public
      const image = new Image();
      image.src = imageUrl;
  
      image.onload = async() => {
        try {

           // Generar el código QR
    const qrCodeData = `Certificado para ${student.nombre}, ID: ${student.id}`;
    const qrCodeImageUrl = await QRCode.toDataURL(qrCodeData);

          doc.addImage(image, "JPG", 0, 0, 297, 210);
          doc.setFontSize(17);
          doc.text( student.nombre, 120, 110);
          doc.text( student.fechaExamen, 115, 130);
          doc.text(student.nivel, 195, 130);
          doc.text(date1, 224, 154);
          
          doc.addImage(qrCodeImageUrl, 'PNG', 250, 10, 40, 40); // Ajusta las coordenadas y tamaño según tus necesidades

          const pdfData = doc.output('datauristring').split(',')[1];
          resolve(pdfData);
        } catch (error) {
          reject(error);
        }
      };
  
      image.onerror = (error) => reject(error);
    });
  };
  //const urlSendEmailFirebase = 'http://127.0.0.1:5001/demopp-fb74e/us-central1/sendEmail'
  //const urlUpdateStudentStatusFirebase = 'http://127.0.0.1:5001/demopp-fb74e/us-central1/updateStudentStatusBd'
  const urlSendEmailFirebase = 'https://api-sgca.vercel.app/send-email'
  const urlUpdateStudentStatusFirebase = 'https://api-sgca.vercel.app/api/updateStudentStatusBd'

  const sendEmail = async (student, collectionName) => {
    
    if (!collectionName) {
      console.error('No collection name provided');
      return;
    }
    try {
      const pdfData = await generatePDF(student);
      //const response = await axios.post('http://localhost:5000/send-email', { student, pdfData });
      
      const emailResponse = await axios.post(urlSendEmailFirebase, { student, pdfData });
      console.log('Respuesta del servidor:', emailResponse.data);
      alert('Email enviado con éxito');
      const date = obtenerFechaEnEspañol();
      // Actualizar el estado del certificado en la base de datos
      const updateResponse = await axios.post(urlUpdateStudentStatusFirebase, {
        documentId: student.id,
        certificadoEnviado: 1,
        fechaEnvio: date,
        collectionName
      });
      console.log('Respuesta de actualización:', updateResponse.data);
    // Actualizar el estado en el frontend
    setStudents((prevStudents) => 
      prevStudents.map((s) => (s.id === student.id ? { ...s, certificadoEnviado: 1 } : s))
    );
    setFilteredStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === student.id ? { ...s, certificadoEnviado: 1, fechaEnvio: date } : s))
   
    
    );
    } catch (error) {
      console.error('Error al enviar el email o actualizar el estado:', error);
    alert('Error al enviar el email o actualizar el estado');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    XLSX.writeFile(workbook, "Lista_Estudiantes.xlsx");
  };
  const [filteredStudents, setFilteredStudents] = useState([]);
  const handleSearch1 = (event) => {
    const query = event.target.value.toLowerCase();
    setCedula(query);
    setFilteredStudents(
      students.filter(student =>
        
        student.nombre.toLowerCase().includes(query)
      )
    );
  };

  useEffect(() => {
    getCollections();
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      
    
      <div className="mr-auto md:mr-4 md:w-56 flex items-center">
           
            <Button color="green" onClick={exportToExcel}>Exportar datos a Excel</Button>
          </div>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>

          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Buscar Estudiante por Nombre
          </Typography>
        </CardHeader>
        <div className="mb-4">
        <Input
              type="text"
              value={cedula}
              onChange={handleSearch1}
              placeholder="Ingresa el nombre para buscar"
            />
          </div>
         
          <div className="flex justify-center">
            <label color="orange" >Escoge la convocatoria:        </label>
            <select className="col-span-2"

              value={collectionName}
              onChange={handleCollectionChange}
            >
              {collections.map((collection) => (

                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>

          </div>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Cédula", "Nombre", "Email", "Nivel", "Fecha Examen", "Fecha Envio","Cumple Requisitos", "Estado Certificado", "Acción Certificado"].map((el) => (
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
                {currentStudents.map((student, key) => {
                  const className = `py-3 px-5 ${
                    key === currentStudents.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={student.id}>
                     
                      <td className={className}>{student.cedula}</td>
                      <td className={className}>{student.nombre}</td>
                      <td className={className}>{student.email}</td>
                      <td className={className}>{student.nivel}</td>
                      <td className={className}>{student.fechaExamen}</td>
                      <td className={className}>{student.fechaEnvio}</td>
                      <td className={className}>{student.cumpleRequisito === 1 ? "SI" : "NO"}</td>
                      <td className={className}>{student.certificadoEnviado === 1 ? "SI" : "NO"}</td>
                      <td className="text-right">
                      <Button
                          color="green"
                          size="sm"
                          onClick={() => sendEmail(student, collectionName)}
                          disabled={student.certificadoEnviado === 1}
                        >
                          Enviar PDF
                        </Button>
                        <Button
                          color="gray"
                          size="sm"
                          onClick={() => generatePDFDownload(student)}
                          disabled={student.certificadoEnviado === 0}
                        >
                          Descargar PDF
                        </Button>
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <nav>
                <ul className="pagination flex">
                  {[...Array(Math.ceil(students.length / studentsPerPage)).keys()].map((number) => (
                    <li key={number + 1} className="page-item">
                      <Button
                        onClick={() => paginate(number + 1)}
                        className="ps-2 pe-2 py-0.5"
                      >
                        {number + 1}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default TablesStudents;