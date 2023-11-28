import React, {useState} from "react";
import {Button, Label, Select, TextInput,} from "flowbite-react";
import {HiOutlineViewGridAdd, HiPlus} from "react-icons/hi";
import {json} from "react-router-dom";

const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;

export const CreateClientsForm = () => {
    // Cuando se presione defaultModalButton mostrar el defaultModal
    const handleModal = () => {
        const defaultModal = document.getElementById("defaultModal");
        defaultModal.classList.remove("hidden");
    };

    // Cuando se presione el botón de cerrar el modal, ocultar el modal
    const handleModalClose = () => {
        const defaultModal = document.getElementById("defaultModal");
        defaultModal.classList.add("hidden");
    };

    const [nit, setNit] = useState("");
    const [dpi, setDpi] = useState("");
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [mail, setMail] = useState("");
    const [direction, setDirection] = useState("");
    const [discount, setDiscount] = useState("");
    const [state, setState] = useState("");
    console.log(nit, dpi, name, tel, mail, direction, discount, state);

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
        console.log(json(data));

        const response = await fetch(`${API}/clients`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
        const result = await response.json();
        console.log(result);
        // Limpiar formulario
        setNit("");
        setDpi("");
        setName("");
        setTel("");
        setMail("");
        setDirection("");
        setDiscount("");
        setState("");
    };

    return (
        <>
            <div
                className="flex justify-center"
                style={{
                    position: "absolute",
                    zIndex: "20",
                }}
            >
                <Button outline={true} id="defaultModalButton" onClick={handleModal}>
                    <HiOutlineViewGridAdd className="h-4 w-4 mr-2"/>
                    Crear Cliente
                </Button>
            </div>
            {/* Default modal */}
            <div className="crear__producto">
                <div
                    id="defaultModal"
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
                                    Añadir un Cliente
                                </h3>
                            </div>
                            {/* Modal body */}
                            <form
                                action="/products"
                                method="POST"
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
                                            onChange={(e) => setDpi(e.target.value)}
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
                                        <option value="Active">Activo</option>
                                        <option value="Inactive">Inactivo</option>
                                    </Select>
                                </div>
                                <div className="flex justify-start items-center gap-4">
                                    <Button type="submit">
                                        <HiPlus className="h-4 w-4 mr-2"/>
                                        Agregar nuevo cliente
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
        </>
    );
};
