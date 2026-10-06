import React, { useState } from "react";

import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

function App() {
  const [page, setPage] = useState("menu");
  const [cart, setCart] = useState([]);

  const goTo = (pageName) => {
    setPage(pageName);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">

      {/* Navigation */}
      <header className="navbar">

        <div
          className="logo"
          onClick={() => goTo("menu")}
        >
          <span className="logo-icon">⚡</span>
          QuickBite
        </div>

        <nav>

          <button
            className={page === "menu" ? "active" : ""}
            onClick={() => goTo("menu")}
          >
            Menu
          </button>

          <button
            className={page === "orders" ? "active" : ""}
            onClick={() => goTo("orders")}
          >
            Orders
          </button>

          <button
            className={page === "admin" ? "active" : ""}
            onClick={() => goTo("admin")}
          >
            Admin
          </button>

          <button
            className="cart-nav"
            onClick={() => goTo("menu")}
          >
            🛒
            <span>
              {cart.reduce(
                (sum, item) => sum + item.qty,
                0
              )}
            </span>
          </button>

        </nav>

      </header>

      {/* Main Content */}
      <main>

        {page === "menu" && (
          <Menu
            cart={cart}
            setCart={setCart}
            goToCheckout={() => goTo("checkout")}
          />
        )}

        {page === "checkout" && (
          <Checkout
            cart={cart}
            setCart={setCart}
            goToMenu={() => goTo("menu")}
            goToOrders={() => goTo("orders")}
          />
        )}

        {page === "orders" && (
          <Orders />
        )}

        {page === "admin" && (
          <Admin />
        )}

      </main>

      {/* Footer */}
      <footer>
        <p>
          © 2026 QuickBite — Mini Food Delivery Application
        </p>
      </footer>

    </div>
  );
}

export default App;