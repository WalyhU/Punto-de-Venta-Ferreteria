import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Navigation} from "./components/Navbar";
import {Products} from "./pages/Products";
import {Users} from "./pages/Users";
import {Clients} from "./pages/Clients";
import {Dashboard} from "./pages/Dashboard";
import {Login} from "./pages/Login";
import {Profile} from "./pages/Profile";
import {NotFound} from "./pages/NotFound";
import {Sales} from "./pages/Sales";
import {DarkThemeToggle, Flowbite} from "flowbite-react";

const token = localStorage.getItem("token");

function App() {
    if (!token || token === "" || token === undefined) {
        return (
            <Router>
                <Flowbite>
                    <DarkThemeToggle/>
                </Flowbite>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        );
    } else {
        return (
            <Router>
                <>
                    <Navigation/>
                    <aside className="container p-10">
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/sales" element={<Sales/>}/>
                            <Route path="/users" element={<Users/>}/>
                            <Route path="/clients" element={<Clients/>}/>
                            <Route path="/products" element={<Products/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </aside>
                    <script src="../path/to/flowbite/dist/flowbite.js"></script>
                </>
            </Router>
        );
    }
}

export default App;
