const fs = require("fs");
const path = require('path');

const ProductManager = require('./productManager');
const productManager = new ProductManager(path.join(__dirname,'./Products.json'));

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async getCarts() {
        return await this.getJsonFromFile(this.path);
    }

    async addCart() {
        const carts = await this.getJsonFromFile(this.path);
        const newCart = {
            id: carts.length + 1,
            products: [],
        };
        carts.push(newCart);
        await this.saveJsonInFile(this.path, carts);
        console.log("Product added");
    }

    async getCartById(ident) {
        const carts = await this.getJsonFromFile(this.path);
        const cartId = carts.find((ide) => ide.id === ident);
        if (!cartId) {
            return null;
        }
        return cartId;
    }

    async addProductInCart(cid, pid) {
        const carts = await this.getJsonFromFile(this.path);
        const cart = carts.find((c) => c.id === cid);
        const productId = await productManager.getProductsById(pid);
      
        if (!productId) {
          throw new Error(`El producto con el id ${pid} no se encuentra.`);
        }
      
        if (cart) {
          const productIndex = cart.products.findIndex((product) => product.pid === productId.id);
      
          if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
          } else {
            const product = {
              pid: productId.id,
              quantity: 1,
            };
            cart.products.push(product);
          }
      
          await this.saveJsonInFile(this.path, carts);
          return cart;
        } else {
          return null;
        }
      }
    

    async getJsonFromFile(path) {
        try {
            if (!fs.existsSync(path)) {
                return [];
            }
            const content = await fs.promises.readFile(path, "utf-8");
            return JSON.parse(content);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async saveJsonInFile(path, data) {
        try {
            const content = JSON.stringify(data, null, "\t");
            await fs.promises.writeFile(path, content, "utf-8");
            console.log("File saved");
        } catch (error) {
            console.error("Error al escribir en el archivo:", error);
        }
    }
}
module.exports = CartManager;

//   async function test() {
//       const cartManager = new CartManager("./Carts.json");
//       const cart1 = {
//           products: [],
//       };

//       const cart2 = {
//           products: [],
//       };
//       //await cartManager.addCart(cart1);
//       //await cartManager.addCart(cart2);
//       console.log(await cartManager.getCarts());
//       console.log(await cartManager.getCartById(2));
//       console.log(await cartManager.addProductInCart(7, 4));
//   }
//   test();
