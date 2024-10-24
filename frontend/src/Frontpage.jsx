import React,{ useState,useEffect } from "react";
import Products from "./Products.jsx";
import "./App.css" 
import ShoppingCart from "./Shoppingcart.jsx";

function Frontpage() {
        const [cart, setCart] = useState ([]); // State that tracks the products added to the cart.
        const [showCart, setShowCart] = useState(false);  //State that toggles between products or cart page.
        const [products, setProducts] = useState([]);

        useEffect(() => {
            fetch("http://localhost:5002/products")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response error");
                    }
                    return response.json();
                })
                .then(data => {
                    setProducts(data); // Set the fetched product data to the products state
                })
                .catch(error => {
                    console.error("Problem fetching products", error);
                });
        }, []);

            // Function to add a product to the cart if there's stock available.
    const addToCart = (productData) => {
        if (productData.stock > 0) {
            // Decrease stock in the backend
            fetch("http://localhost:5002/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: productData.id, change: -1 }),
            })
            .then(response => response.json())
            .then(updatedProduct => {
            // Add the updated product (with reduced stock) to the cart
            setCart((prevCart) => [...prevCart, productData]);

            // Update the stock locally for the displayed products
            setProducts((prevProducts) => 
                prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
            );
        })
        .catch(error => {
            console.error("Error updating stock", error);
        });
    }
};

//Function that clears the cart
    const deleteCart = () => {
        // Create a map to keep track of stock adjustments
        const stockUpdates = {};

        // Count how many of each item is in the cart
        cart.forEach(product => {
            stockUpdates[product.id] = (stockUpdates[product.id] || 0) + 1; // Initialize or increment
        });

        // Send a request to update the stock for each product
        Promise.all(
            Object.keys(stockUpdates).map(productId => {
                return fetch("http://localhost:5002/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId: parseInt(productId), change: stockUpdates[productId] }) // Restore stock
                });
            })
        )
        .then(responses => {
            responses.forEach(response => {
                if (!response.ok) {
                    throw new Error("Error updating stock");
                }
            });
            // Clear the cart after restoring stock
            setCart([]);
            setShowCart(false); // Redirect to product page after clearing the cart
        })
        .catch(error => {
            console.error("Error during clearing cart process:", error);
        });
    };


// Function "Makes" a purchase by displaying a thank you message and clearing the cart.
const buyCart = () => {
    const stockUpdates = new Map();

    // Count how many of each item is in the cart for checkout
    cart.forEach(product => {
        const currentCount = stockUpdates.get(product.id) || 0;
        stockUpdates.set(product.id, currentCount + 1);  // Increment count
    });

    // Send a request to update the stock for each product
    Promise.all(
        Object.keys(stockUpdates).map(productId => {
            return fetch("http://localhost:5002/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: parseInt(productId), change: -stockUpdates[productId] }) // Decrease stock
            });
        })
    )
    .then(responses => {
        responses.forEach(response => {
            if (!response.ok) {
                throw new Error("Error updating stock");
            }
        });
        alert("Thank you for your purchase!");
        setCart([]); // Clear the cart after successful checkout
        setShowCart(false); // Redirect to product page after checkout
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
        <ShoppingCart cart={cart} deleteCart={deleteCart} buyCart={buyCart} />
      ) : (
        <Products addToCart={addToCart} />
      )}

    </div>
    );
};


export default Frontpage;
