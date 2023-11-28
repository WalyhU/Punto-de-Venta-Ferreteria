import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Checkbox, Label, Navbar, TextInput} from "flowbite-react";
import {HiInformationCircle} from "react-icons/hi";

const API = process.env.REACT_APP_FERRETERIA_API;
const token = localStorage.getItem("token");
console.log(`Token: ${token}`);

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, password, remember);
        const opts = {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({
                email, password, remember,
            }),
        };

        try {
            const resp = await fetch(`${API}/login`, opts);
            if (resp.status !== 200) {
                console.log("Error al iniciar sesión");
                let message = await resp.json();
                // eslint-disable-next-line no-unused-expressions
                message.msg ? setError(` ${message.msg}`) : setError("Error al iniciar sesión");
                setEmail("")
                setPassword("")
                return false;
            }

            const data = await resp.json();
            console.log(`ESTO VIENE DEL BACKEND ${data}`);
            localStorage.setItem("token", data.access_token);
            window.location.reload();
        } catch (error) {
            console.log(`HAY UN ERROOOOORRR ${error}`);
        }
    };

    useEffect(() => {
        // Una vez la interfaz ha sido renderizada ejecuta el codigo:
        if (token && token !== "" && token !== undefined) {
            navigate("/");
        }
    },);

    return (<>
        {token && token !== "" && token !== undefined ? (`You are logged in with this token ${token}`) : (
            <div className="contenedor">
                <Navbar.Brand href="https://flowbite.com/" className="mb-10">
                    <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="mr-3 h-6 sm:h-9"
                        alt="Flowbite Logo"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              FERRETERIA
            </span>
                </Navbar.Brand>
                <form
                    className="flex flex-col gap-4 w-50 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Correo"/>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="nombre@dominio.com"
                            required={true}
                            shadow={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Contraseña"/>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            required={true}
                            shadow={true}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <Label htmlFor="remember">Recuerdame</Label>
                    </div>
                    <Button type="submit" onClick={handleSubmit}>
                        Iniciar Sesión
                    </Button>
                    {
                        error && error !== "" && error !== undefined ? (

                            <Alert
                                color="failure"
                                icon={HiInformationCircle}
                                onDismiss={() => setError("")}
                            >
                  <span>
                    <span className="font-medium">¡Error!</span>
                      {error}
                  </span>
                            </Alert>
                        ) : null
                    }
                </form>
            </div>)}
    </>);
};
