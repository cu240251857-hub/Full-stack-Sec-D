import { useEffect, useState } from "react";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getOrders,
  updateOrderStatus
} from "../api";
import StatusBadge from "../components/StatusBadge";

function Admin() {
  const emptyForm = {
    name: "",
    price: "",
    category: "Main Course",
    isAvailable: true
  };

  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [itemsResponse, ordersResponse] = await Promise.all([
        getItems(),
        getOrders()
      ]);
      setItems(itemsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const submitItem = async e => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      const data = { ...form, price: Number(form.price) };

      if (editingId) {
        await updateItem(editingId, data);
        setMessage("Menu item updated successfully.");
      } else {
        await addItem(data);
        setMessage("Menu item added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save item");
    }
  };

  const editItem = item => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeItem = async id => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await deleteItem(id);
      setMessage("Menu item deleted successfully.");
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete item");
    }
  };

  const advanceOrder = async order => {
    const nextStatuses = {
      Placed: "Preparing",
      Preparing: "Out for Delivery",
      "Out for Delivery": "Delivered"
    };

    const nextStatus = nextStatuses[order.status];
    if (!nextStatus) return;

    try {
      await updateOrderStatus(order._id, nextStatus);
      setMessage(`Order moved to ${nextStatus}.`);
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <span className="small-label">RESTAURANT ADMIN</span>
        <h1>Admin Dashboard</h1>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <section className="admin-section">
        <h2>{editingId ? "Edit Menu Item" : "Add Menu Item"}</h2>

        <form className="admin-form" onSubmit={submitItem}>
          <input
            name="name"
            placeholder="Item name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <select name="category" value={form.category} onChange={handleChange}>
            <option>Starters</option>
            <option>Main Course</option>
            <option>Desserts</option>
            <option>Drinks</option>
          </select>

          <label className="availability">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <button type="submit">
            {editingId ? "Update Item" : "Add Item"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="admin-section">
        <h2>Menu Items</h2>

        <div className="admin-table">
          <div className="table-header">
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Available</span>
            <span>Actions</span>
          </div>

          {items.map(item => (
            <div className="table-row" key={item._id}>
              <span>{item.name}</span>
              <span>{item.category}</span>
              <span>₹{item.price.toFixed(2)}</span>
              <span>{item.isAvailable ? "Yes" : "No"}</span>

              <span className="actions">
                <button onClick={() => editItem(item)}>Edit</button>
                <button className="danger" onClick={() => removeItem(item._id)}>
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Manage Orders</h2>

        <div className="admin-orders">
          {orders.map(order => (
            <div className="admin-order" key={order._id}>
              <div>
                <strong>#{order._id.slice(-6)}</strong>
                <p>{order.customerName}</p>
                <small>{order.items.length} item(s)</small>
              </div>

              <StatusBadge status={order.status} />

              <strong>₹{order.totalAmount.toFixed(2)}</strong>

              {order.status !== "Delivered" &&
                order.status !== "Cancelled" && (
                  <button onClick={() => advanceOrder(order)}>
                    {order.status === "Placed"
                      ? "Prepare"
                      : order.status === "Preparing"
                      ? "Out for Delivery"
                      : "Mark Delivered"}
                  </button>
                )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;
