const fs = require('fs')

class ProductManager {
    
    constructor(path){
        this.products = [];
        this.path = path;
    }

    writeFile =  async () => {
        try{
            const productsObj = {
                products: this.products
            }
            const productsStr = JSON.stringify(productsObj)
            await fs.promises.writeFile(this.path, productsStr)
        } catch(err) {
            console.log(err)
        }
    }

    readFile = async () => {
        try{
            const file = await fs.promises.readFile(this.path, 'utf-8')
            const productsObj = JSON.parse(file)
            // console.log('Objeto leido del archivo json:', productsObj)
            this.products = productsObj.products
        } catch(err) {
            console.log(err)
        }
    }

    addProduct = async (product) => {
        const {code, title, description, price, thumbnail, stock} = product 
        if (!code || !title || !description || !price || !thumbnail || !stock){
            return 'Debe ingresar la totalidad de los parámetros'
        }
        
        await this.readFile();
        
        const duplicates = this.products.find( prd => prd.code === code);
        if (duplicates) {
            return 'El codigo ya existe, ingrese un producto distinto o ingrese otro código'
        } 

        const prd = {
            code,
            title, 
            description, 
            price, 
            thumbnail, 
            stock
        }

        //construcción de ID
        prd.id = this.products.length>0 ? this.products[this.products.length-1].id + 1 : 0
        
        this.products.push(prd)
        await this.writeFile()
        return prd
    }
    
    getProducts = async () => {
        await this.readFile();
        return this.products;
    }
    
    getProductById = async (id) => {
        await this.readFile();
        const prd = this.products.find( p => `${p.id}` === id);
        return prd || 'Not found'
    }
    
    updateProduct = async (id, objUpdate) => {
        await this.readFile();
        const i = this.products.findIndex( p => p.id === id);
        if (i >= 0){
            Object.assign(this.products[i], objUpdate)
            await this.writeFile()
            return this.products[i]
        } else {
            return 'ID no encontrado'
        }
    }
    
    deleteProduct = async (id) => {
        await this.readFile();
        const i = this.products.findIndex( p => p.id === id);
        if (i >= 0){
            this.products.splice(i,1);
            await this.writeFile()
            return 'Producto eliminado con éxito'
        } else {
            return 'ID no encontrado'
        }
    }
}

module.exports = ProductManager

// const productList = new ProductManager('./data.json')
// console.log('---------------inicia-------------')
// let product = {}
// let res;

// const program = async () => {
    
//     //Creating new products
//     product = {
//         code: 'A2',
//         title: 'Mouse', 
//         description: 'Mouse Logitech', 
//         price: 20,
//         thumbnail: 'http://me.pick.com', 
//         stock: 34
//     }
//     res = await productList.addProduct(product)
//     console.log('addProduct:', res)
    
//     product = {
//         code: 'A3',
//         title: 'Keyboard', 
//         description: 'Keyboard Logitech', 
//         price: 30,
//         thumbnail: 'http://me.pick.com', 
//         stock: 4
//     }
//     res = await productList.addProduct(product)
//     console.log('addProduct:', res)
    
//     //Get products
//     res = await productList.getProducts()
//     console.log('getProducts:', res)
    
//     //Get product by ID
//     res = await productList.getProductById(0)
//     console.log('getProductById:', res)

//     //updateProduct
//     const objUpdate = {
//         title: 'Keyboard Pro',
//         price: 35
//     }
//     res = await productList.updateProduct(1, objUpdate)
//     console.log(res)
    
//     //deleteProduct
//     res = await productList.deleteProduct(1)
//     console.log(res)
// }

// program()


// console.log('Muestra array vacío:' ,productList.getProducts());
// const res1 = productList.addProduct('A1', 'Notebook', 'Notebook de 17 pulgadas HP', 3000, 'http://me.pick.com', 10);
// console.log('Respuesta:', res1);
// const res2 = productList.addProduct('A2','Mouse', 'Mouse Logitech', 20, 'http://me.pick.com', 34);
// console.log('Respuesta:', res2);
// console.log('Intentamos agregar un producto con un CODE ya existente:');
// const res3 = productList.addProduct('A2','Mouse', 'Mouse Logitech', 20, 'http://me.pick.com', 34);
// console.log('Respuesta:', res3);
// console.log('Intentamos agregar un producto sin el campo stock:');
// const res4 = productList.addProduct('A3','Camera', 'Camera Logitech', 35, 'http://me.pick.com');
// console.log('Respuesta:', res4);
// console.log('Muestra los dos productos cargados:', productList.getProducts());
// console.log('Solicitud de producto inexistente:', productList.getProductById(100));
