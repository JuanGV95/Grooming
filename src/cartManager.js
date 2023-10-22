const fs = require('fs');

class CartManager {
    constructor(path){
        this.carts = [];
        this.path = path;
    }

    async getCarts() {
        return await this.getJsonFromFile(this.path);
    }

    async addCart(){
        const carts = await this.getJsonFromFile(this.path);
        const newCart = {
            id: carts.length + 1,
            products: []
        };
        carts.push(newCart);
        await this.saveJsonInFile(this.path, carts);
        console.log('Product added')
    }



    async getCartById(ident){
        const carts = await this.getJsonFromFile(this.path);
        const cartId = carts.find((ide)=> ide.id === ident);
        if(!cartId){
            return null;
        }
        return cartId
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
module.exports = CartManager;

 async function test(){
     const cartManager = new CartManager('./Carts.json');
 const cart1 = {
     products: [], 
 }

 const cart2 = {
    products: [],
 }
 //await cartManager.addCart(cart1);
 //await cartManager.addCart(cart2);
 console.log(await cartManager.getCarts());
console.log(await cartManager.getCartById(2));
 }
test()