import React from "react"
import "./"

const ShoppingCart = ({cart, deleteCart, buyCart}) =>{
	const totPrice = cart.reduce((total, product) => total + product.price, 0);

	return (
		<div className="cart">
			<h3>Cart</h3>
			{cart.lenght === 0 ? ("Your cart is empty") : 
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
			}
		</div>
	);
};

export default ShoppingCart;