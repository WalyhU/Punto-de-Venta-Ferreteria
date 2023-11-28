import React from "react";
import {HiCheck, HiPrinter, HiX} from "react-icons/hi";
import {formatCurrency} from "../scripts/formatCurrency";
import {Button} from "flowbite-react";
import {NumberAsString} from "../scripts/numeroALetras";

export const SuccessMessage = ({hidden, type, title, message, withicon, products, icon}) => {

    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (!hidden) {
            setShow(true);
        }
    }, [hidden]);

    // Al darle a la X, ocultamos el mensaje
    const close = () => {
        setShow(false);
    }
    return (
        <div>
            {/* Main modal */}
            <div id="successModal" tabIndex={-1} aria-hidden={show} style={{
                height: "100%",
                display: show ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
                 className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-start items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    {/* Modal content */}
                    <div className="relative p-20 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <button type="button"
                                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="successModal"
                                aria-label="Close"
                                onClick={close}
                        >
                            <HiX className="w-5 h-5"/>
                            <span className="sr-only">Cerrar Ventana</span>
                        </button>
                        {withicon ? (
                            <div
                                className="w-12 h-12 flex items-center justify-center mx-auto mb-3.5">
                                <HiCheck className="w-12 h-12 text-green-500 dark:text-green-400"/>
                                <span className="sr-only">{type}</span>
                            </div>
                        ) : null}
                        <h3 style={{
                            letterSpacing: "-0.1px",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "1.125rem",
                            lineHeight: "1.75rem",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}>{title}</h3>
                        <p className="mb-4 text-lg text-gray-900 dark:text-gray-400" style={{
                            letterSpacing: "-0.5px",
                            fontWeight: "300",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "1rem",
                            textAlign: "left",
                        }}>{message}</p>
                        {products ?
                            <>
                                {products.products.map((product, index) => (
                                    <div key={index} style={{
                                        letterSpacing: "-0.5px",
                                        fontWeight: "300",
                                        fontFamily: "Roboto, sans-serif",
                                        fontSize: "1rem",
                                        textAlign: "left",
                                        display: "block",
                                        padding: "0.5rem",
                                    }}>
                                        <div className="grid grid-cols-4" style={
                                            // hacer la segunda columna más pequeña
                                            {
                                                gridTemplateColumns: "0.5fr 0.5fr 2.3fr 1fr",
                                        }}>
                                            <>
                                                <HiCheck className="rounded-full bg-green-400 text-green-800" style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                    fontSize: ".5rem",
                                                }}/>
                                                <p className="text-gray-900 dark:text-gray-400">{product.quantity}</p>
                                                <p className="text-gray-900 dark:text-gray-400">{product.name}</p>
                                                <p className="text-gray-900 dark:text-gray-400">{formatCurrency(product.subtotal)}</p>
                                            </>
                                        </div>
                                    </div>
                                ))}
                                {/*  Insertar Total  */}
                                <div style={{
                                    fontWeight: "800",
                                    fontFamily: "Roboto, sans-serif",
                                    marginTop: "1rem",
                                    textAlign: "right",
                                    fontSize: "1rem",
                                    letterSpacing: "-0.5px",
                                }}>
                                    <p className="text-gray-900 dark:text-gray-400">Total: {formatCurrency(products.total)}</p>
                                    <p className="text-gray-900 dark:text-gray-400" style={{
                                        letterSpacing: "-0.5px",
                                        fontSize: "0.8rem",
                                        lineHeight: "15px",
                                        marginBottom: "0.5rem",
                                    }}>{NumberAsString(products.total)}</p>
                                </div>
                            </> : null}
                        <Button color="gray" onClick={
                            () => {
                                window.print();
                            }
                        }>
                            <HiPrinter className="w-5 h-5" style={{marginRight:"5px"}}/>Imprimir Factura
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}