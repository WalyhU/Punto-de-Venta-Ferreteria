import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { CreateProductsForm } from "../components/CreateProductsForm";
import { HiSearch, HiTrash, HiUpload } from "react-icons/hi";
import { getItems } from "../scripts/getItems";
import { formatCurrency } from "../scripts/formatCurrency";
const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;

export const Products = () => {
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  let modalName = "update_product";

  const cargar = async () => {
    setProducts(await getItems("products"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("code", code);
    data.append("name", name);
    data.append("brand", brand);
    data.append("category", category);
    data.append("price", price);
    data.append("stock", stock);
    data.append("description", description);
    if (image) {
      data.append("image", image);
    }

    const response = await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const result = await response.json();
    console.log(result);
    // Limpiar formulario
    setCode("");
    setName("");
    setBrand("");
    setCategory("DEFAULT");
    setPrice("");
    setStock("");
    setDescription("");
    setImage("");
    // Ocultar el modal
    handleModalClose();
    // Recargar la tabla
    await cargar();
  };

  const deleteProduct = async (id) => {
    const response = await fetch(`${API}/products/${id}`, {
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

  const editProducts = async (id) => {
    const response = await fetch(`${API}/product/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    handleModal();

    setId(id);
    setCode(result.code);
    setName(result.name);
    setBrand(result.brand);
    setCategory(result.category);
    setPrice(result.price);
    setStock(result.stock);
    setDescription(result.description);
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
      <div className="crear__producto">
        <div
          id={modalName}
          tabIndex={-1}
          aria-hidden="true"
          className="hidden shadow-md overflow-y-auto overflow-x-hidden fixed top-50 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
        >
          <div
            className="relative p-4 w-full max-w-2xl h-full md:h-auto"
            style={{ margin: "auto" }}
          >
            {/* Modal content */}
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              {/* Modal header */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Actualizar un Producto
                </h3>
              </div>
              {/* Modal body */}
              <form
                action={`/products/${id}`}
                method="PUT"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="code" value="Código de Barras" />
                    </div>
                    <TextInput
                      name="code"
                      id="code"
                      placeholder="Código de barras"
                      required
                      autoComplete="off"
                      onChange={(e) => setCode(e.target.value)}
                      value={code}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Nombre" />
                    </div>
                    <TextInput
                      name="name"
                      id="name"
                      placeholder="Nombre del producto"
                      required
                      autoComplete="off"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="brand" value="Marca" />
                    </div>
                    <TextInput
                      name="brand"
                      id="brand"
                      placeholder="Marca del producto"
                      required
                      autoComplete="off"
                      onChange={(e) => setBrand(e.target.value)}
                      value={brand}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <TextInput
                      type="number"
                      name="price"
                      id="price"
                      placeholder="2999"
                      required
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      id="category"
                      required
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                    >
                      <option value="DEFAULT" disabled>
                        Seleccionar categoría
                      </option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <TextInput
                      type="number"
                      name="stock"
                      id="stock"
                      placeholder="64"
                      required
                      onChange={(e) => setStock(e.target.value)}
                      value={stock}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Escribe la descripción del producto acá."
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  </div>
                </div>
                {/* Preview of the image */}
                <div className="flex justify-between items-center mb-6">
                  {image ? (
                    <img
                      alt="Preview"
                      className="h-auto rounded-lg shadow-xl dark:shadow-gray-800"
                      style={{
                        width: "150px",
                        marginRight: "20px",
                      }}
                      src={image ? URL.createObjectURL(image) : null}
                    />
                  ) : null}
                  <div
                    id="fileUpload"
                    className="mb-5"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div className="mb-2 mt-2 block">
                      <Label htmlFor="file" value="Subir portada de producto" />
                    </div>
                    <FileInput
                      id="file"
                      accept=".jpg, .png"
                      helperText="Sube una portada del producto para mostrar en la tienda."
                      onChange={(e) => setImage(e.target.files[0])}
                      filename={""}
                    />
                  </div>
                </div>
                <div className="flex justify-start items-center gap-4">
                  <Button type="submit">
                    <HiUpload
                      className="h-5 w-5"
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    Actualizar Producto
                  </Button>
                  <Button
                    outline={true}
                    color="failure"
                    onClick={() => {
                      deleteProduct(id);
                      handleModalClose();
                    }}
                  >
                    <HiTrash
                      className="h-5 w-5"
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    Eliminar Producto
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
      <CreateProductsForm recargar={getItems} />
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <div className="absolute right-10" style={{ zIndex: "20" }}>
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar Productos"
          />
        </div>
        <Table hoverable={true} className="mt-20">
          <Table.Head>
            <Table.HeadCell>Imagen</Table.HeadCell>
            <Table.HeadCell>Código</Table.HeadCell>
            <Table.HeadCell>Nombre del producto</Table.HeadCell>
            <Table.HeadCell>Marca</Table.HeadCell>
            <Table.HeadCell>Precio del producto</Table.HeadCell>
            <Table.HeadCell>Categoría</Table.HeadCell>
            <Table.HeadCell>Stock</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Editar</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {products.map((product) => (
              <Table.Row
                key={product._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="p-4 w-40">
                  <img
                    src={`${API}/static/uploads/${product.image}`}
                    alt="Product"
                    className="h-auto rounded-lg"
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {product.code}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {product.name}
                </Table.Cell>
                <Table.Cell>{product.brand}</Table.Cell>
                <Table.Cell>{formatCurrency(product.price)}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>{product.stock}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell>
                  <Button
                    outline={true}
                    onClick={() => editProducts(product._id)}
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
