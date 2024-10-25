import React,{ useState,useEffect } from "react";
import Products from "./Products.jsx";
import ShoppingCart from "./Shoppingcart.jsx";
import "./App.css" 

function Frontpage() {
        const [cart, setCart] = useState ([]); 
        const [showCart, setShowCart] = useState(false);  
        const [products, setProducts] = useState([]);

        // Retrieve product data
        useEffect(() => {
            fetch("http://localhost:5002/products")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response error");
                    }
                    return response.json();
                })
                .then(data => {
                    setProducts(data); 
                })
                .catch(error => {
                    console.error("Problem fetching products", error);
                });
        }, []);


    // Adds products to the cart and update stock on the server      
    const addToCart = (productData) => {
        const cartCount = cart.filter((item) => item.id === productData.id).length;

        if (cartCount < productData.stock) {
         
            fetch("http://localhost:5002/products", {
                method: "POST",                      
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: productData.id, change: -1 }),
            })
            .then(response => response.json())
            .then(updatedProduct => {
           
            setCart((prevCart) => [...prevCart, productData]);


            setProducts((prevProducts) => 
                prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
            );
        })
        .catch(error => {
            console.error("Error updating stock", error);
        });
    } else { 
        alert("Sorry, no more items available in stock.");
    }
};


//Function that clears the cart and restores stock to server
const clearCart = () => {
   
    const stockUpdates = {};

 
    cart.forEach(product => {
        stockUpdates[product.id] = (stockUpdates[product.id] || 0) + 1;
    });

    // Send request to restore stock for each product in stockUpdates
    Promise.all(
        Object.keys(stockUpdates).map(productId => {
            return fetch("http://localhost:5002/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: parseInt(productId), change: stockUpdates[productId] }) 
            }).then(response => response.json());
        })
    )
    .then(updatedProducts => {

        updatedProducts.forEach(updatedProduct => {
            if (!updatedProduct || !updatedProduct.id) {
                throw new Error("Error updating stock");
            }
        });

        
        setProducts(prevProducts =>
            prevProducts.map(product =>
                updatedProducts.find(p => p.id === product.id) || product
            )
        );

        
        setCart([]);
        setShowCart(false);
    })
    .catch(error => {
        console.error("Error during clearing cart process:", error);
    });
};


    // Processes checkout reduces stock and clears the cart
    const buyCart = () => {
    const stockUpdates = new Map();

    //
    cart.forEach(product => {
        const currentCount = stockUpdates.get(product.id) || 0;
        stockUpdates.set(product.id, currentCount + 1); 
    });

    
    Promise.all(
        Object.keys(stockUpdates).map(productId => {
            return fetch("http://localhost:5002/products", {
                method: "POST",                           
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: parseInt(productId), change: -stockUpdates[productId] }) 
            });
        })
    )
    .then(responses => {
        responses.forEach(response => {
            if (!response.ok) {
                throw new Error("Error updating stock");
            }
        });
        // Clear the cart after checkout and redirect to product page
        alert("Thank you for your purchase!");
        setCart([]); 
        setShowCart(false);
    })
    .catch(error => {
        console.error("Error during checkout process:", error);
    });
};





return (
    <div className="App">
        {/*Create navbar that contains product and cartbuttons. "Your cart" will display ammount of items in the cart */}
        <nav>
            <button onClick={() =>setShowCart(false)}>Products</button>
            <button onClick={() =>setShowCart(true)}>Your Cart {cart.length}</button>
        </nav>

        {/* Render either the shopping cart or product page */}
        {showCart ? (
        <ShoppingCart cart={cart} clearCart={clearCart} buyCart={buyCart} />
      ) : (
        <Products addToCart={addToCart} />
      )}

    </div>
    );
};


export default Frontpage;
