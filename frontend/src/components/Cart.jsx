function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  total,
  checkout
}) {
  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <span>Add some delicious food!</span>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={item._id}>
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>

                <div className="quantity">
                  <button onClick={() => decreaseQuantity(item._id)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                </div>

                <button
                  className="remove"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          <button className="checkout-button" onClick={checkout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
