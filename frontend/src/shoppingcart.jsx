import React from "react"

// The ShoppingCart component displays the contents of the cart and provides options to delete or checkout the cart
const ShoppingCart = ({cart, deleteCart, buyCart,}) =>{
	
	const multipleItems = cart.reduce((acc, product) => {
        if (acc[product.id]) {
            acc[product.id].quantity += 1;  // If product exists, increment quantity
        } else {
            acc[product.id] = { ...product, quantity: 1 }; // Otherwise, initialize with quantity 1
        }
        return acc;
    }, {});

	const totPrice = Object.values(multipleItems).reduce((total, product) => total + product.price * product.quantity, 0);; //Calculate total price


	

	return (
		<div className="cart">
			<h3>Cart</h3>
			{cart.length === 0 ? ("Your cart is empty") : (
			<div>
				<ul>
				{Object.values(multipleItems).map((product) => (
                            <li key={product.id}>
                                {product.name} - {product.price} kr x{product.quantity}
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