import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api";
import StatusBadge from "../components/StatusBadge";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async id => {
    try {
      await updateOrderStatus(id, "Cancelled");
      setMessage("Order cancelled successfully.");
      loadOrders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <span className="small-label">ORDER HISTORY</span>
        <h1>Your Orders</h1>
      </div>

      {message && <div className="message">{message}</div>}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="empty">No orders yet.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <span className="order-id">Order #{order._id.slice(-6)}</span>
                  <h3>{order.customerName}</h3>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name} × {item.qty}</span>
                    <strong>₹{(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>

                {order.status === "Placed" && (
                  <button
                    className="cancel-button"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
