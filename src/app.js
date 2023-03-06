const port = 3000
const express = require('express')

const ProductManager = require('./productManager')

const app = express()

const productManager = new ProductManager('./data.json')

app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    const { limit } = req.query
    const products = await productManager.getProducts()
    const filterProducts = limit ? products.slice(0, limit) : products
    res.json({ filterProducts })

})

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const products = await productManager.getProductById(pid)
    res.json({ products })
})

app.listen(port, () => console.log(`Server on port ${port}`))