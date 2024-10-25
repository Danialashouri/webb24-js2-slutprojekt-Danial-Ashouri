import React, {useState, useEffect} from "react";
import "./App.css";

function Products({addToCart}) {
    const [products, setProducts] = useState([]);
    //Fetch products from backend
    useEffect(() => {
        fetch("http://localhost:5002/products")
            .then(response => {
                if (!response.ok) {
                    throw new Error ("Network response error");
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched products:", data);  // Log the fetched data
                setProducts(data);
            })
            .catch(error => {
                console.error("Problem fetching products", error);
            });
    }, []);

     return (
        <div className="Productline">
           {products.map((product) => (
            <div key={product.id} className="product-card"> 
                <img src={product.image} alt={product.name} /> 
                <h2>{product.name}</h2>
                <h2>{product.price} kr</h2>
                <p>Stock: {product.stock}</p>

                <button 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}       // Disables button if product stock is 0 
                className={product.stock === 0 ? 'disabled' : ''} 
            >
                {product.stock > 0 ? "BUY" : "OUT OF STOCK"} {/* Changes button text based on stock */}
            </button>
            </div> 
           ))} 
        </div>    
    );
};

export default Products