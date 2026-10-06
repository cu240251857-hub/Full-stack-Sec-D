function MenuCard({ item, addToCart }) {
  return (
    <div className="menu-card">
      <div className="food-icon">🍽️</div>
      <div className="menu-card-content">
        <span className="category">{item.category}</span>
        <h3>{item.name}</h3>
        <div className="food-bottom">
          <strong>₹{item.price.toFixed(2)}</strong>
          <button
            onClick={() => addToCart(item)}
            disabled={!item.isAvailable}
          >
            {item.isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
