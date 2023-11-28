import React, { useState } from "react";
import {
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { HiPlus, HiOutlineViewGridAdd } from "react-icons/hi";
import { json } from "react-router-dom";
const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;

export const CreateProductsForm = () => {
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

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("DEFAULT");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

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
    data.append("image", image);
    console.log(json(data));

    const response = await fetch(`${API}/products`, {
      method: "POST",
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
          <HiOutlineViewGridAdd className="h-4 w-4 mr-2" />
          Crear Producto
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
            style={{ margin: "auto" }}
          >
            {/* Modal content */}
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              {/* Modal header */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Añadir un Producto
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
                      src={URL.createObjectURL(image)}
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
                      filename={image}
                    />
                  </div>
                </div>
                <div className="flex justify-start items-center gap-4">
                  <Button type="submit">
                    <HiPlus className="h-4 w-4 mr-2" />
                    Agregar nuevo producto
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
