import React, {useEffect, useState} from "react";
import {Button, Label, Select, Table, TextInput,} from "flowbite-react";
import {CreateClientsForm} from "../components/CreateClientsForm";
import {HiSearch, HiTrash, HiUpload} from "react-icons/hi";
import {getItems} from "../scripts/getItems";

const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;

export const Clients = () => {
    const [clients, setClients] = useState([]);
    const [id, setId] = useState("");
    const [nit, setNit] = useState("");
    const [dpi, setDPI] = useState("");
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [mail, setMail] = useState("");
    const [direction, setDirection] = useState("");
    const [discount, setDiscount] = useState("");
    const [state, setState] = useState("DEFAULT");
    let modalName = "update_client";

    const cargar = async () => {
        setClients(await getItems("clients"));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("nit", nit);
        data.append("dpi", dpi);
        data.append("name", name);
        data.append("tel", tel);
        data.append("mail", mail);
        data.append("direction", direction);
        data.append("discount", discount);
        data.append("state", state);

        const response = await fetch(`${API}/clients/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
        const result = await response.json();
        console.log(result);
        // Limpiar formulario
        setNit("");
        setDPI("");
        setName("");
        setTel("");
        setMail("");
        setDirection("");
        setDiscount("");
        setState("");
        // Ocultar el modal
        handleModalClose();
        // Recargar la tabla
        await cargar();
    };

    const deleteClient = async (id) => {
        const response = await fetch(`${API}/clients/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        console.log(result);
        await cargar();
    };

    useEffect(() => {
        cargar().then(r => console.log(r));
    }, []);

    const editClients = async (id) => {
        const response = await fetch(`${API}/client/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        handleModal();

        setId(id);
        setNit(result.nit);
        setDPI(result.dpi);
        setName(result.name);
        setTel(result.tel);
        setMail(result.mail);
        setDirection(result.direction);
        setDiscount(result.discount);
        setState(result.state);
    };

    // Cuando se presione defaultModalButton mostrar el defaultModal
    const handleModal = () => {
        const defaultModal = document.getElementById(modalName);
        defaultModal.classList.remove("hidden");
    };

    // Cuando se presione el botón de cerrar el modal, ocultar el modal
    const handleModalClose = () => {
        const defaultModal = document.getElementById(modalName);
        defaultModal.classList.add("hidden");
    };

    return (
        <>
            <div className="crear__cliente">
                <div
                    id={modalName}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden shadow-md overflow-y-auto overflow-x-hidden fixed top-50 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
                >
                    <div
                        className="relative p-4 w-full max-w-2xl h-full md:h-auto"
                        style={{margin: "auto"}}
                    >
                        {/* Modal content */}
                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            {/* Modal header */}
                            <div
                                className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Actualizar Cliente
                                </h3>
                            </div>
                            {/* Modal body */}
                            <form
                                action={`/clients/${id}`}
                                method="PUT"
                                encType="multipart/form-data"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="nit" value="Código de Barras"/>
                                        </div>
                                        <TextInput
                                            name="nit"
                                            id="nit"
                                            placeholder="NIT del Cliente"
                                            required
                                            autoComplete="off"
                                            onChange={(e) => setNit(e.target.value)}
                                            value={nit}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="dpi" value="DPI"/>
                                        </div>
                                        <TextInput
                                            name="dpi"
                                            id="dpi"
                                            placeholder="DPI del cliente"
                                            required
                                            autoComplete="off"
                                            onChange={(e) => setDPI(e.target.value)}
                                            value={dpi}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="name" value="Nombre"/>
                                        </div>
                                        <TextInput
                                            name="name"
                                            id="name"
                                            placeholder="Nombre del cliente"
                                            required
                                            autoComplete="off"
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tel">Teléfono</Label>
                                        <TextInput
                                            type="number"
                                            name="tel"
                                            id="tel"
                                            placeholder="42360275"
                                            required
                                            onChange={(e) => setTel(e.target.value)}
                                            value={tel}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="mail">Correo</Label>
                                        <TextInput
                                            type="mail"
                                            name="mail"
                                            id="mail"
                                            placeholder="example@site.com"
                                            required
                                            onChange={(e) => setMail(e.target.value)}
                                            value={mail}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="direction">Dirección</Label>
                                        <TextInput
                                            name="direction"
                                            id="direction"
                                            placeholder="Pueblo Abajo, Sansare, El Progreso"
                                            onChange={(e) => setDirection(e.target.value)}
                                            value={direction}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="discount">Descuento</Label>
                                        <TextInput
                                            type="number"
                                            name="discount"
                                            id="discount"
                                            placeholder="10"
                                            required
                                            onChange={(e) => setDiscount(e.target.value)}
                                            value={discount}
                                            style={{
                                                textAlign: "right",
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        paddingTop: "21px",
                                    }}>
                                        <span className="text-gray-500 text-sm">%</span>
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <Label htmlFor="state">Estado</Label>
                                    <Select
                                        id="state"
                                        required
                                        onChange={(e) => setState(e.target.value)}
                                        defaultValue={"DEFAULT"}
                                    >
                                        <option value="DEFAULT" disabled>
                                            Seleccionar estado
                                        </option>
                                        {
                                            state === "Active" ? (
                                                    <>
                                                        <option value="Active" selected>
                                                            Activo
                                                        </option>
                                                        <option value="Inactive">
                                                            Inactivo
                                                        </option>
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        <option value="Active">
                                                            Activo
                                                        </option>
                                                        <option value="Inactive" selected>
                                                            Inactivo
                                                        </option>
                                                    </>
                                                )
                                        }
                                    </Select>
                                </div>
                                <div className="flex justify-start items-center gap-4">
                                    <Button type="submit">
                                        <HiUpload
                                            className="h-5 w-5"
                                            style={{
                                                marginRight: "5px",
                                            }}
                                        />
                                        Actualizar Cliente
                                    </Button>
                                    <Button
                                        outline={true}
                                        color="failure"
                                        onClick={() => {
                                            deleteClient(id);
                                            handleModalClose();
                                        }}
                                    >
                                        <HiTrash
                                            className="h-5 w-5"
                                            style={{
                                                marginRight: "5px",
                                            }}
                                        />
                                        Eliminar Cliente
                                    </Button>
                                    <Button color="failure" onClick={handleModalClose}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <CreateClientsForm recargar={getItems("clients")}/>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <div className="absolute right-10" style={{zIndex: "20"}}>
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <HiSearch className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Buscar Clientes"
                    />
                </div>
                <Table hoverable={true} className="mt-20">
                    <Table.Head>
                        <Table.HeadCell>NIT del Cliente</Table.HeadCell>
                        <Table.HeadCell>DPI del Cliente</Table.HeadCell>
                        <Table.HeadCell>Nombre del Cliente</Table.HeadCell>
                        <Table.HeadCell>Telefono</Table.HeadCell>
                        <Table.HeadCell>Correo</Table.HeadCell>
                        <Table.HeadCell>Dirección</Table.HeadCell>
                        <Table.HeadCell>Descuento</Table.HeadCell>
                        <Table.HeadCell>Estado</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Editar</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {clients.map((client) => (
                            <Table.Row
                                key={client._id}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.nit}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.dpi}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.name}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.tel}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.mail}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.direction}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.discount} %
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                        {client.state === "Active" ? "Activo" : "Inactivo"}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        outline={true}
                                        onClick={() => editClients(client._id)}
                                    >
                                        Editar
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
};
