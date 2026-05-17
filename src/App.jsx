import { SHOE_LIST } from "./constants.js";
import Nav from "./components/Nav";
import NewArrivalsSection from "./components/NewArrivalsSection";
import ShoeDetail from "./components/ShoeDetail";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import Cart from "./components/Cart.jsx";
import { BiSun, BiMoon } from "react-icons/bi";

export default function App() {
  console.log("ENV: ", import.meta.env.VITE_APP_TITLE);
  const [sideBarOpen, isSideBarOpen] = useState(false);
  useEffect(() => {
    const isdarkMode = localStorage.getItem("isdarkMode");
    if (isdarkMode && isdarkMode === "true") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "isdarkMode",
      document.documentElement.classList.contains("dark"),
    );
  };
  const [cartItems, setCartItems] = useState([]);
  return (
    <div className="animate-fadeIn dark:bg-night p-10 xl:px-24">
      <Nav onClickCart={() => isSideBarOpen(true)} />
      <ShoeDetail setCartItems={setCartItems} cartItems={cartItems} />
      <NewArrivalsSection
        items={SHOE_LIST}
        setCartItems={setCartItems}
        cartItems={cartItems}
      />
      <Sidebar isOpen={sideBarOpen} onClickCart={() => isSideBarOpen(false)}>
        <Cart items={cartItems} setCartItems={setCartItems} />
      </Sidebar>
      <div className="fixed right-4 bottom-4">
        <button
          onClick={toggleDarkMode}
          className="bg-night-50 dark:text-night cursor-pointer rounded-full px-4 py-2 text-white shadow-lg dark:bg-white"
        >
          <BiSun className="hidden dark:block" />
          <BiMoon className="dark:hidden" />
        </button>
      </div>
    </div>
  );
}
