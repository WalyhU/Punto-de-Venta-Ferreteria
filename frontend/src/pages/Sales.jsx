import {Label, Table} from "flowbite-react";
import React, {useState} from "react";
import {HiCalendar, HiMinusSm, HiPlusSm, HiSearch, HiShoppingCart, HiUserAdd,} from "react-icons/hi";
import {formatCurrency} from "../scripts/formatCurrency";
import {SuccessMessage} from "../components/SuccessMessage";

const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;

export const Sales = () => {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let todayFormat = now.getFullYear() + "-" + (month) + "-" + (day);

    const [today, setToday] = useState(todayFormat);
    const [code, setCode] = useState("");
    const [products, setProducts] = useState([]);
    const [nit, setNit] = useState("");
    const [client, setClient] = useState("");
    const [total, setTotal] = useState(0);
    const [show, setShow] = useState(true);
    const [productsMessage, setProductsMessage] = useState(false);

    // Cliente: {product.client ? product.client : "C/F"}

    const buscarProducto = async (e) => {
        e.preventDefault();
        // si el code ya existe en products, no se agregará sino que se aumentará la cantidad
        if (products.find((product) => product.code === code)) {
            setCode("");
            // Aumentar la cantidad del producto
            products.map((product) => {
                if (product.code === code) {
                    product.quantity++;
                    product.subtotal = product.quantity * parseFloat(product.price);
                }
                return product;
            }, []);

            let newTotal = total;
            newTotal += parseFloat(products.find((product) => product.code === code).price);
            setTotal(newTotal);
            return;
        }
        const response = await fetch(`${API}/codeProduct/${code}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        let product = [...products, result];
        setProducts(product);
        // crear cantidad del producto agregado sin afectar el resto
        product.map((product) => {
            if (product.code === code) {
                product.quantity = 1;
                product.subtotal = product.quantity * parseFloat(product.price);
            }
            return product;
        }, []);
        setTotal(parseFloat(total) + parseFloat(result.price));
        // recargar el componente
        setCode("");
        // obtener el id del input de default-search y enfocarlo
        document.getElementById("default-search").focus();
    };

    const buscarCliente = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API}/nitClient/${nit}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setClient(await response.json());
        setNit("");
    }

    const borrarCliente = () => {
        setClient("");
    }

    const guardarVenta = async () => {
        const order = {
            date: `${today}`,
            client: client,
            products: products,
            total: total + total * 0.12 - total * parseFloat(`0.${client.discount < 10 ? `0${client.discount}` : client.discount}`),
        }

        setProductsMessage(order);
        const response = await fetch(`${API}/sales`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(order),
        });
        if (response.status === 200) {
            // descontar del stock los productos vendidos
            products.map(async (product) => {
                const response = await fetch(`${API}/stock/${product._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        stock: product.stock - product.quantity,
                    }),
                });
                return product;
            }, []);
            setShow(false);
            setTimeout(() => {
                setShow(true);
            }, 3000);
            setProducts([]);
            setTotal(0);
            setClient("");
        } else {
            alert("Error al guardar la venta");
        }
    }

    return (
        <div>
            <div
                className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <SuccessMessage
                    hidden={show}
                    title="Venta creada correctamente."
                    message="La venta se ha creado correctamente con los siguientes productos."
                    products={productsMessage}
                    withicon={false}
                    button="Cerrar"/>
                Crear Venta <HiShoppingCart/>
            </div>
            <div
                className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <div
                    className="relative"
                    style={{
                        width: "49%",
                    }}
                >
                    <form method="post" onSubmit={buscarProducto}>
                        <Label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Agregar Producto
                        </Label>
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <HiSearch className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Buscar por Codigo de Barras..."
                            autoComplete={"off"}
                            onChange={(e) => setCode(e.target.value)}
                            value={code}
                            required
                        />
                        <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Agregar Producto
                        </button>
                    </form>
                </div>
                <div
                    className="relative"
                    style={{
                        width: "49%",
                    }}
                >
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <HiUserAdd className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="client"
                        id="default-client"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Buscar cliente por NIT"
                        required
                        onChange={(e) => setNit(e.target.value)}
                        value={nit}
                    />
                    <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={buscarCliente}
                    >
                        Buscar
                    </button>
                </div>
            </div>
            {/* Mostrar la fecha de hoy */}
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t sm:mb-5 dark:border-gray-600">
                <div
                    className="relative"
                    style={{
                        width: "49%",
                    }}
                >
                    <Label
                        htmlFor="default-date"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Fecha
                    </Label>
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <HiCalendar className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="date"
                        id="default-date"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Buscar por Codigo de Barras..."
                        required
                        onChange={(e) => setToday(e.target.value)}
                        value={today}
                    />
                </div>
                {client ? (
                    <div className="grid gap-4 sm:grid-cols-3 relative" style={{textAlign: "right",}}>
                        <div className="relative" style={{width: "100%",}}>
                            <Label className="font-extrabold" style={{fontSize: "20px"}}>NIT: </Label><br/>
                            <Label style={{fontSize: "23px"}}>{client.nit}</Label>
                        </div>
                        <div className="relative" style={{width: "100%",}}>
                            <Label className="font-extrabold" style={{fontSize: "20px"}}>Descuento: </Label> <br/>
                            <Label style={{fontSize: "23px"}}>{client.discount} %</Label>
                        </div>
                        <div className="relative" style={{width: "100%",}}>
                            <Label className="font-extrabold" style={{fontSize: "20px"}}>Cliente: </Label> <br/>
                            <Label style={{fontSize: "23px"}}>{client.name}</Label>
                        </div>
                        <div style={{position: "absolute", bottom: "-30px", right: "0"}}>
                            <button
                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                onClick={borrarCliente}
                            >
                                Quitar
                            </button>
                        </div>
                    </div>) : (
                    <div className="gap-4" style={{textAlign: "right",}}>
                        <div className="relative" style={{width: "100%",}}>
                            <Label className="font-extrabold" style={{fontSize: "20px"}}>NIT: </Label><br/>
                            <Label style={{fontSize: "23px"}}>C/F</Label>
                        </div>
                    </div>
                )}
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Total: {formatCurrency(total + total * 0.12 - total * parseFloat(`0.${client.discount < 10 ? `0${client.discount}` : client.discount}`))}
            </h1>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <Table>
                    <Table.Head
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <Table.HeadCell scope="col" className="py-3 px-6">
                            <span className="sr-only">Imagen</span>
                        </Table.HeadCell>
                        <Table.HeadCell scope="col" className="py-3 px-6">
                            Producto
                        </Table.HeadCell>
                        <Table.HeadCell scope="col" className="py-3 px-6">
                            Cantidad
                        </Table.HeadCell>
                        <Table.HeadCell scope="col" className="py-3 px-6">
                            Precio
                        </Table.HeadCell>
                        <Table.HeadCell scope="col" className="py-3 px-6">
                            Total
                        </Table.HeadCell>
                        <Table.HeadCell scope="col" className="py-3 px-6">
                            Acción
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {products.map((product) => (
                            <Table.Row key={product._id}>
                                <Table.Cell className="p-4 w-32">
                                    <img
                                        src={`${API}/static/uploads/${product.image}`}
                                        alt={product.name}
                                    />
                                </Table.Cell>
                                <Table.Cell className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                                    {product.name}
                                </Table.Cell>
                                <Table.Cell className="py-4 px-6">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white rounded-full border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            type="button"
                                            onClick={() => {
                                                if (product.quantity > 1) {
                                                    product.quantity -= 1;
                                                    product.subtotal = product.quantity * parseFloat(product.price);
                                                    setProducts([...products]);
                                                    setTotal(total - parseFloat(product.price));
                                                }
                                            }}
                                        >
                                            <span className="sr-only">Boton de cantidad</span>
                                            <HiMinusSm/>
                                        </button>
                                        <div>
                                            <input
                                                type="number"
                                                id="first_product"
                                                className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={1}
                                                value={product.quantity}
                                                onChange={(e) => {
                                                    product.quantity = parseInt(e.target.value);
                                                    product.subtotal = parseInt(product.quantity) * parseFloat(product.price);
                                                    setProducts([...products]);
                                                    setTotal(total + product.subtotal);
                                                }}
                                                disabled={true}
                                                required
                                            />
                                        </div>
                                        <button
                                            className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white rounded-full border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            type="button"
                                            onClick={() => {
                                                product.quantity += 1;
                                                product.subtotal = parseInt(product.quantity) * parseFloat(product.price);
                                                setProducts([...products]);
                                                setTotal(total + parseInt(product.price));
                                            }}
                                        >
                                            <span className="sr-only">Boton de cantidad</span>
                                            <HiPlusSm/>
                                        </button>
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(product.price)}
                                </Table.Cell>
                                <Table.Cell className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(product.subtotal)}
                                </Table.Cell>
                                <Table.Cell className="py-4 px-6">
                                    <button
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => {
                                            setTotal(total - product.subtotal);
                                            setProducts(
                                                products.filter((p) => p._id !== product._id)
                                            );
                                            document.getElementById("default-search").focus();
                                        }}
                                    >
                                        Quitar
                                    </button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            {products.length > 0 ? (

                <div className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Subtotal
                        </span>
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            {formatCurrency(total)}
                        </span>
                        </div>
                        <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Impuesto
                        </span>
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            {formatCurrency(total * 0.12)}
                        </span>
                        </div>
                        <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Descuento
                        </span>
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            {formatCurrency(total * parseFloat(`0.${client.discount < 10 ? `0${client.discount}` : client.discount}`))}
                        </span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Total
                    </span>
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {formatCurrency(total + total * 0.12 - total * parseFloat(`0.${client.discount < 10 ? `0${client.discount}` : client.discount}`))}
                    </span>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                            onClick={() => guardarVenta()}
                            disabled={products.length === 0}
                        >
                            Realizar pedido
                        </button>
                    </div>
                </div>) : (
                <div className="flex flex-col justify-between p-4">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                <span style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    textAlign: "center",
                }
                } className="text-lg font-medium text-gray-600 dark:text-gray-400">
                AGREGA UN PRODUCTO...
                </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
