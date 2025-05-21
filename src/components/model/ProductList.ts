import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class ProductList {
    protected items: IProduct[];
    protected preview: IProduct;

    constructor (protected events: IEvents) {}

    setProducts (productsArray: IProduct[]): void {
        this.items = productsArray;
        this.events.emit ('productList: change', this.items);
    }

    setPreview (product: IProduct): void {
        this.preview = product;
        this.events.emit('productList: preview', this.preview);
    }

    getProducts ():IProduct[] {
        return this.items;
    }

    getProductById (id:string):IProduct {
        return this.items.find(product => product.id === id);  
    }
}