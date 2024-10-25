const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5002;
const fs = require ("fs");
const path = require("path"); 

app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your React app
    methods: ['GET', 'POST',],         // Allowed request methods
}));

app.use(express.json());


const productsdbFilePath = path.join(__dirname, "productsdb.json")

app.get('/', (req, res) => {
    res.send('hello, this is my backendserver');
});


//Handle stock
app.get("/products", (req, res) => {                                                
    fs.readFile(productsdbFilePath, (err, data) => {  
        if (err) {
            return res.status(500).json({ error: "Error reading product" });
        }
        const products = JSON.parse(data); 
        res.json(products); 
    });
});

app.post("/products", (req, res) => {
    const { productId, change } = req.body;  // Get productId and change (-1 for reducing, +1 for restoring)

    fs.readFile(productsdbFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading product data" });
        }
        const products = JSON.parse(data);
        const product = products.find(p => p.id === productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" }); // Add this check
        }

        product.stock += change;

        fs.writeFile(productsdbFilePath, JSON.stringify(products), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error updating item stock" });
            }
            res.json(product);
        });
    });
});                                                                             

//Handle stock


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
