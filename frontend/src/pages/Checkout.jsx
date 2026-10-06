import { useState } from "react";
import { createOrder } from "../api";

function Checkout({ cart, setCart, goToMenu, goToOrders }) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async e => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!form.customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (!form.address.trim()) {
      setError("Please enter your address.");
      return;
    }

    try {
      await createOrder({
        customerName: form.customerName.trim(),
        phone: form.phone,
        address: form.address.trim(),
        items: cart.map(item => ({
          itemId: item._id,
          qty: item.qty
        }))
      });

      setCart([]);
      setMessage("Order placed successfully!");
      setForm({ customerName: "", phone: "", address: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to place order");
    }
  };

  if (message) {
    return (
      <div className="success-page">
        <div className="success-icon">✓</div>
        <h1>Order Placed!</h1>
        <p>Your delicious food is being prepared.</p>
        <button onClick={goToOrders}>View Orders</button>
        <button className="secondary-button" onClick={goToMenu}>
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={goToMenu}>← Back to Menu</button>
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Delivery Details</h2>

          {error && <div className="error-message">{error}</div>}

          <label>
            Full Name
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength="10"
              placeholder="10 digit phone number"
            />
          </label>

          <label>
            Delivery Address
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter delivery address"
              rows="5"
            />
          </label>

          <button type="submit" className="place-order">
            Place Order
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>

          {cart.map(item => (
            <div className="summary-item" key={item._id}>
              <span>{item.name} × {item.qty}</span>
              <strong>₹{(item.price * item.qty).toFixed(2)}</strong>
            </div>
          ))}

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
