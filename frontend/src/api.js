import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getItems = (search = "", category = "") =>
  API.get("/items", { params: { search, category } });

export const addItem = item => API.post("/items", item);
export const updateItem = (id, item) => API.put(`/items/${id}`, item);
export const deleteItem = id => API.delete(`/items/${id}`);

export const createOrder = order => API.post("/orders", order);
export const getOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.patch(`/orders/${id}/status`, { status });
