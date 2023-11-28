import React from "react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title"> Dashboard</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead className=" text-primary">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Telefono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Nombre</td>
                      <td>Correo</td>
                      <td>Telefono</td>
                      <td>
                        <Link to="/edit/1">
                          <button className="btn btn-primary btn-sm">
                            <i className="fas fa-edit"></i>
                          </button>
                        </Link>
                        <button className="btn btn-danger btn-sm">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
