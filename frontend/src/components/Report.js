import { Redirect } from "react-router-dom"
import React, { useState, useEffect } from "react";
import Plot from "./Plot";

const API = process.env.REACT_APP_API;


export const Report = () => {
  const rol = sessionStorage.getItem("Rol")
  const id = sessionStorage.getItem("id");
  const em = sessionStorage.getItem("email")
  const [files, setFiles] = useState([]);

  const getFiles = async () => {

    const opts = {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo: id,
      }),
    };

    const res = await fetch(`${API}/getfiles`, opts);
    const data = await res.json();
    setFiles(data);
  }

  useEffect(() => {
    getFiles();
  }, [])



  const DeleFile = async (id) => {
    const res = await fetch(`${API}/deleteFile/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    console.log(data);
    getFiles();
  };

  const Download = async () => {

    const opts = {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Codigo: id,
      }),
    };

    const res = await fetch(`${API}/download/report/pdf`, opts)
    const data = await res.blob()
    const url = window.URL.createObjectURL(new Blob([data]),);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `FileName.pdf`
    );
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();
    // Clean up and remove the link
    link.parentNode.removeChild(link);

  }

  return (
    <div>
      {rol === "1" ? <Redirect to="/index" /> :


        <div className="row" style={{ maxWidth: '99vw' }}>

          <div className="TABLA  col-md-7 m-5">
            <table className="table table-bordered">
              <thead className="bg-primary text-white">
                <tr>
                  <th scope="col">Turno</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Materia</th>
                  <th scope="col">Archivo</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {files.map(item => (
                  <tr key={item.id}>
                    <td>{item.shift}</td>
                    <td>{item.evidenceType}</td>
                    <td>{item.courseName}</td>
                    <td>{item.fileName}</td>
                    <td className="text-center">
                      <button onClick={() => DeleFile(item.id)} className="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="PLOT  col-md-4 m-4 ">

            <div className="Codigo mt-3">
              <label className="form-label mt-2" htmlFor="readOnlyInput">Correo Institucional:</label>
              <input className="form-control" value={em} id="readOnlyInput" type="text" placeholder="Ninguno" readOnly />
            </div>
            <div className="Codigo mt-1 mb-4">
              <label className="form-label mt-2" htmlFor="readOnlyInput">Codigo:</label>
              <input className="form-control" value={id} id="readOnlyInput" type="text" placeholder="Ninguno" readOnly />
            </div>
            <div className="border border-dark mb-3">
              <Plot />
            </div>
            <div className="text-center d-grid gap-2">
              <button onClick={() => Download()} type="button" className="btn btn-lg btn-success">Generar Reporte</button>
            </div>

          </div>

        </div>

      }
    </div>
  );
};
export default Report;