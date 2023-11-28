import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useMediaQuery } from "react-responsive";
import { Tabs, Table, Button, Label, Select } from "flowbite-react";
const token = localStorage.getItem("token");

const API = process.env.REACT_APP_FERRETERIA_API;

export const Users = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          rol,
        }),
      });
      const data = await res.json();
      console.log(data);
    } else {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          rol,
        }),
      });
      const data = await res.json();
      console.log(data);
      setEditing(false);
      setId("");
    }
    await getUsers();
    setName("");
    setEmail("");
    setPassword("");
    setRol(null);
  };

  const getUsers = async () => {
    const opt = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`${API}/users`, opt);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    // Una vez la interfaz ha sido renderizada ejecuta el codigo:
    getUsers();
  }, []);

  const editUser = async (id) => {
    const opt = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`${API}/user/${id}`, opt);
    const data = await res.json();
    setEditing(true);
    setId(id);
    console.log(data);
    setName(data.name);
    setEmail(data.email);
    setRol(data.rol);
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "¿Estás Seguro?",
      text: "¡No puedes revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Elimínalo!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Eliminado!",
          "El dato se ha eliminado correctamente.",
          "success"
        );
        const res = await fetch(`${API}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        await getUsers();
      }
    });
  };
  return (
    <>
      {/* eslint-disable-next-line */}
      <Tabs.Group aria-label="Tabs with underline" style="underline">
        <Tabs.Item active={editing ? true : null} title="Formulario">
          <div
            className={`grid gap-6 mb-6 ${
              isTabletOrMobile ? "mt-10" : ""
            } md:grid-cols-2`}
          >
            <form
              onSubmit={handleSubmit}
              method="post"
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="mb-6">
                <label
                  htmlFor="nombre"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  id="nombre"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nombre"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="correo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Correo
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  id="correo"
                  value={email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Correo"
                  autoComplete="off"
                />
              </div>
              <div id="select" className="mb-6">
                <div className="mb-2 block">
                  <Label htmlFor="rol" value="Selecciona el ROL" />
                </div>
                <Select
                  id="rol"
                  required={true}
                  onChange={(e) => setRol(e.target.value)}
                  defaultValue={"DEFAULT"}
                >
                  <option value={"DEFAULT"} disabled>
                    Selecciona el rol...
                  </option>
                  {rol === "1" ? (
                    <option value="1" selected>
                      Administrador
                    </option>
                  ) : (
                    <option value="1">Administrador</option>
                  )}
                  {rol === "2" ? (
                    <option value="2" selected>
                      Vendedor
                    </option>
                  ) : (
                    <option value="2">Vendedor</option>
                  )}
                  {rol === "3" ? (
                    <option value="3" selected>
                      Cliente
                    </option>
                  ) : (
                    <option value="3">Cliente</option>
                  )}
                </Select>
              </div>
              {
                // Si no estamos editando, mostramos el input de contraseña
                !editing ? (
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      value={password}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Contraseña"
                    />
                  </div>
                ) : null
              }
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-6"
              >
                {editing ? "Actualizar" : "Crear"}
              </button>
              {editing ? (
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-6 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() => {
                    setEditing(false);
                    setId("");
                    setName("");
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Cancelar
                </button>
              ) : null}
            </form>
          </div>
        </Tabs.Item>
        <Tabs.Item active={editing ? null : true} title="Tabla">
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <Table>
              <Table.Head>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Correo</Table.HeadCell>
                <Table.HeadCell>Rol</Table.HeadCell>
                <Table.HeadCell>Operaciones</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {users.map((user) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={user._id}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.rol === "1" ? "Administrador" : null}
                      {user.rol === "2" ? "Vendedor" : null}
                      {user.rol === "3" ? "Cliente" : null}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <Button
                          color="gray"
                          className="mr-2"
                          onClick={() => editUser(user._id)}
                        >
                          Editar
                        </Button>
                        <Button
                          color="failure"
                          className="mr-2"
                          onClick={() => deleteUser(user._id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};
