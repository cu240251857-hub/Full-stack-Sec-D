import { useEffect, useState } from "react";
import MenuCard from "../components/MenuCard";
import Cart from "../components/Cart";
import { getItems } from "../api";

function Menu({ cart, setCart, goToCheckout }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const categories = ["Starters", "Main Course", "Desserts", "Drinks"];

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await getItems(search, category);
      setItems(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [search, category]);

  const addToCart = item => {
    setCart(previousCart => {
      const existing = previousCart.find(cartItem => cartItem._id === item._id);

      if (existing) {
        return previousCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }

      return [...previousCart, { ...item, qty: 1 }];
    });

    setMessage(`${item.name} added to cart`);
  };

  const increaseQuantity = id => {
    setCart(previousCart =>
      previousCart.map(item =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQuantity = id => {
    setCart(previousCart =>
      previousCart
        .map(item =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeFromCart = id => {
    setCart(previousCart => previousCart.filter(item => item._id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      <section className="hero">
        <div>
          <span className="hero-label">QUICK • FRESH • DELICIOUS</span>
          <h1>Your favourite food,<br />delivered fast.</h1>
          <p>Order delicious meals from QuickBite and enjoy them at home.</p>
        </div>
      </section>

      {message && <div className="message">{message}</div>}

      <div className="menu-layout">
        <main className="menu-section">
          <div className="section-heading">
            <div>
              <span className="small-label">OUR MENU</span>
              <h2>What are you craving?</h2>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading menu...</p>
          ) : items.length === 0 ? (
            <div className="empty">No menu items found.</div>
          ) : (
            <div className="menu-grid">
              {items.map(item => (
                <MenuCard key={item._id} item={item} addToCart={addToCart} />
              ))}
            </div>
          )}
        </main>

        <Cart
          cart={cart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          removeFromCart={removeFromCart}
          total={total}
          checkout={goToCheckout}
        />
      </div>
    </div>
  );
}

export default Menu;
