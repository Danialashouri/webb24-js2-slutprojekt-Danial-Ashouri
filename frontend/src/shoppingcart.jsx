import React from "react"

// The ShoppingCart component displays the contents of the cart and provides options to delete or checkout the cart
const ShoppingCart = ({cart, deleteCart, buyCart,}) =>{
	const totPrice = cart.reduce((total, product) => total + product.price, 0); //Calculate total price

	

	return (
		<div className="cart">
			<h3>Cart</h3>
			{cart.length === 0 ? ("Your cart is empty") : (
			<div>
				<ul>
					{cart.map((product, index) => (
						<li key={index}>
							{product.name} - {product.price} kr
						</li>
					))}
				</ul>
				<p>Total: {totPrice}:-</p>
				<button onClick={deleteCart}>Clear cart</button>
				<button onClick={buyCart}>Checkout</button>
			</div>
			)}
		</div>
	);
};

export default ShoppingCart;