import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class Basket {
    protected products: IProduct[];

    constructor (protected events: IEvents) {}

    isProductIn(productId: string): boolean {
        return this.products.some(product => product.id === productId);
    } // метод, проверяющий наличие товара в корзине по его Id

    getBasketProducts():IProduct[] {
        return this.products;
    } 

    getTotalSum(): number {
        return this.products.reduce((total, product) => total + product.price, 0);
    } // метод, осуществляющий подсчет общей суммы товаров в корзине
    
    getItemsCount(): number {
        return this.products.length;
    } // метод, осуществляющий подсчет количества товаров в корзине
    
    isBasketEmpty(): boolean {
        return (this.products.length === 0);
    } // метод, проверяющий наличие товаров в корзине
    
    addProduct(product: IProduct): void {
        this.products.push(product);
        this.events.emit('basket: add', product);
    } // добавляется продукт в корзину (в конец массива _productsBasket)
    
    deleteProduct(productId: string):void {
        this.products = this.products.filter((product) => product.id!==productId);
        this.events.emit('basket: delete', {productId});
    } // удаляется товар из массива по указанному в аргументе id
    
    clearBasket():void {
        this.products = [];
        this.events.emit('basket: clear');
    } // очищает содержимое корзины (массива _productsBasket)

}