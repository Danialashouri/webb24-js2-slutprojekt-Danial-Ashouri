import React,{ useState } from "react";
import Products from "./items";
import "./App.css" 
import ShoppingCart from "./shoppingcart";

function Frontpage() {
        const [cart, setCart] = useState ([]);
        const [showCart, setShowcart] = useState(false);

    const addToCart = (product) => {
        if (product.stock > 0) {
    setCart((prevCart) => [...prevCart, product]);
    }
};

const deleteCart = () => {
    setCart([]);
};

const buyCart = () => {
    alert("Thank you for your purchase!");
    deleteCart();
};

return (
    <div className="App">
        {/*Create navbar that contains product and cartbuttons. "Your cart" will display ammount of items in the cart */}
        <nav>
            <button onClick={() =>setShowcart(false)}>Products</button>
            <button onClick={() =>setShowcart(true)}>Your Cart ({cart.lenght})</button>
        </nav>

        {showCart ? (
        <ShoppingCart cart={cart} deleteCart={deleteCart} buyCart={buyCart} />
      ) : (
        <Products addToCart={addToCart} />
      )}

    </div>
    );
};

export default Frontpage; 
