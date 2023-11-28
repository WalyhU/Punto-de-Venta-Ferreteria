import React, { useEffect, useState } from "react";
import MediaQuery from "react-responsive";
import {
  Navbar,
  Sidebar,
  Avatar,
  Flowbite,
  DarkThemeToggle,
} from "flowbite-react";
import {
  HiChartPie,
  HiUser,
  HiShoppingBag,
  HiLogin,
  HiLogout,
  HiShoppingCart, HiUsers,
} from "react-icons/hi";
import "flowbite";
const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;

export const Navigation = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Obtain data from user
  const [user, setUser] = useState({});

  useEffect(() => {
    if (token && token !== "" && token !== undefined) {
      const getUser = async () => {
        const resp = await fetch(`${API}/session`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await resp.json();
        setUser(data);
      };
      getUser();
    }
  }, []);

  return (
    <>
      <MediaQuery minWidth={1024}>
        <div className="w-fit mt-10 ml-10">
          <Sidebar aria-label="Sidebar with logo branding example">
            <Sidebar.Logo
              href="/"
              img="https://flowbite.com/docs/images/logo.svg"
              imgAlt="Flowbite logo"
            >
              Ferreteria
            </Sidebar.Logo>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {token && token !== "" && token !== undefined ? (
                  <Sidebar.Item
                    href="/profile"
                    style={{
                      paddingLeft: "0",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Avatar
                      img=""
                      rounded={true}
                      style={{
                        justifyContent: "flex-start",
                      }}
                    >
                      <div className="space-y-1 font-medium dark:text-white">
                        <div>{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.rol === "1" ? "Administrador" : null}
                          {user.rol === "2" ? "Vendedor" : null}
                          {user.rol === "3" ? "Cliente" : null}
                        </div>
                      </div>
                    </Avatar>
                  </Sidebar.Item>
                ) : null}
                <Sidebar.Item href="/" icon={HiChartPie}>
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item href="/sales" icon={HiShoppingCart}>
                  Ventas
                </Sidebar.Item>
                <Sidebar.Item href="/clients" icon={HiUsers}>
                  Clientes
                </Sidebar.Item>
                <Sidebar.Item href="/users" icon={HiUser}>
                  Usuarios
                </Sidebar.Item>
                <Sidebar.Item href="/products" icon={HiShoppingBag}>
                  Productos
                </Sidebar.Item>
                {token && token !== "" && token !== undefined ? (
                  <Sidebar.Item
                    onClick={() => logout()}
                    href="/"
                    icon={HiLogout}
                  >
                    Cerrar sesión
                  </Sidebar.Item>
                ) : (
                  <Sidebar.Item href="/login" icon={HiLogin}>
                    Iniciar sesión
                  </Sidebar.Item>
                )}
                <Flowbite>
                  <DarkThemeToggle />
                </Flowbite>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={1023}>
        <div style={{ width: "100vw" }}>
          <Navbar fluid={true} rounded={true}>
            <Navbar.Brand href="https://flowbite.com/">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Ferreteria
              </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar.Link href="/" active={true}>
                Home
              </Navbar.Link>
              <Navbar.Link href="/about">About</Navbar.Link>
              <Navbar.Link href="/users">Users</Navbar.Link>
              <Navbar.Link href="/">Dashboard</Navbar.Link>
              <Navbar.Link href="/">Contact</Navbar.Link>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </MediaQuery>
    </>
  );
};
