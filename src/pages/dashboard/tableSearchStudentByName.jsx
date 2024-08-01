import React, { useState } from "react";
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";

export function TableSearchStudentByName() {
  const [id, setId] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const urlGetStudentByIdFirebase = 'http://127.0.0.1:5001/demopp-fb74e/us-central1/getStudentById'
  const handleSearch = async () => {
    const collectionName = 'CON01-JUL2024';
    try {
      
      const response = await axios.get(urlGetStudentByIdFirebase, {
        params: {
          collectionName: collectionName,
          studentId: id
        }
      });
      setStudents(response.data);
      console.log(response.data);
      setError('');
    } catch (error) {
      console.error('Error getting student: ', error);
      setStudents([]);
      setError('No students found with this id');
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Buscar Estudiante por Cedula
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <div className="mb-4">
            <Input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ingresa el nombre del estudiante"
            />
          </div>
          <Button color="blue" onClick={handleSearch}>
            Buscar
          </Button>
          {error && <Typography color="red" className="mt-4">{error}</Typography>}
          {students.length > 0 && (
            <div className="mt-4">
              <Typography variant="h6">Resultados de la Búsqueda</Typography>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Cedula", "Nombre", "Email", "Nivel", "Fecha Examen", "Cumple Requisitos", "Certificado Enviado"].map((el) => (
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
                        <td className={className}>{student.nombre}</td>
                        <td className={className}>{student.email}</td>
                        <td className={className}>{student.nivel}</td>
                        <td className={className}>{student.fechaExamen}</td>
                        <td className={className}>{student.cumpleRequisito}</td>
                        <td className={className}>{student.certificadoEnviado}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default TableSearchStudentByName;