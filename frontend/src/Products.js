import React from "react";
import products from "./items";
import "./App.css";



const Products = ({addToCart}) => {
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
                disabled={product.stock === 0}
                className={product.stock === 0 ? 'disabled' : ''}
            >

            </button>
            </div> 
           ))} 
        </div>    
    );
};

export default Products