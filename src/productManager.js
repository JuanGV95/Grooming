const fs = require('fs');

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    // getProduct

    async getProducts() {
        return await this.getJsonFromFile(this.path);
    }

    // addProduct

    async addProduct(data) {
        const { title, description, price, status, category, thumbnails, code, stock } = data;
        if (!title || !description || !price || !status || !category || !thumbnails || !code || !stock) {
            throw new Error('Todos los campos son requeridos');
        }
        const products = await this.getJsonFromFile(this.path);
        const productCode = products.find((cod) => cod.code === code)

        if (productCode) {
            console.error(`El código ${code} ya está registrado`)
            return null;
        } else {
            const newProduct = {
                id: products.length + 1,
                title,
                description,
                price,
                status,
                category,
                thumbnails,
                code,
                stock
            };
            products.push(newProduct);
            await this.saveJsonInFile(this.path, products)
            console.log('Product added');
        }
    }

    // getProductsById
    async getProductsById(ident) {
    const products = await this.getJsonFromFile(this.path);
    const productId = products.find((ide) => ide.id === ident);
    if (!productId) {
        return null; 
    }
    return productId;
}

    // updateProduct
    async updateProduct(id, data){
        const { title, description, price, thumbnail, code, stock } = data;
        const products = await this.getJsonFromFile(this.path);
        const position = products.findIndex((u) => u.id === id);
        if(position === -1){
            throw new Error('Product not found');
        }
        if(title){
            products[position].title = title;
        }
        if(description){
            products[position].description = description;
        }
        if(price){
            products[position].price = price;
        }
        if(thumbnail){
            products[position].thumbnail = thumbnail;
        }
        if(code){
            products[position].code = code;
        }
        if(stock){
            products[position].stock = stock;
        }

        await this.saveJsonInFile(this.path, products);
        console.log('Product actualized succesfully!');

    }
    

    // deleteProduct
    async deleteProduct(id) {
        const products = await this.getJsonFromFile(this.path);
        const position = products.findIndex((u) => u.id === id);
        
        if (position === -1) {
            throw new Error('Product not found');
        }
        

        products.splice(position, 1);

        for (let i = 0; i < products.length; i++) {
            products[i].id = i + 1;
        }

        await this.saveJsonInFile(this.path, products);
        console.log('ID del producto eliminado: ', id);
    }

    async getJsonFromFile(path) {
        try {
            if (!fs.existsSync(path)) {
                return [];
            }
            const content = await fs.promises.readFile(path, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            return [];
        }
    }

    async saveJsonInFile(path, data) {
        try {
            const content = JSON.stringify(data, null, '\t');
            await fs.promises.writeFile(path, content, 'utf-8');
            console.log('File saved');
        } catch (error) {
            console.error('Error al escribir en el archivo:', error);
        }
    }

}
module.exports = ProductManager;

//   async function test() {
//       const productManager = new ProductManager('./Products.json');
//       const data = {
//           title: 'producto prueba',
//           description: 'Este es un producto prueba',
//           price: 200,
//           thumbnail: 'sin imagen',
//           code: '123abc',
//           stock: 25
//       }
//       const data2 = {
//           title: 'producto prueba',
//           description: 'Este es un producto prueba',
//           price: 200,
//           thumbnail: 'sin imagen',
//           code: 'abc123',
//           stock: 25
//       }
//       const data3 = {
//           title: 'producto prueba',
//           description: 'Este es un producto prueba',
//           price: 200,
//           thumbnail: 'sin imagen',
//           code: 'a1b2c3',
//           stock: 25
//       }
//       //await productManager.addProduct(data);
//       //await productManager.addProduct(data2);
//       //await productManager.addProduct(data3);
//       //await productManager.updateProduct(1,{title: 'producto prueba nombre cambiado jejejeje'})
//       await productManager.getProducts();
//       //console.log(await productManager.deleteProduct(2));
//       console.log(await productManager.getProductsById(1));
//       console.log(await productManager.getProducts())
//   }

//  test()

