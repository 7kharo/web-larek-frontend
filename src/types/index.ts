type ProductType = 'софт-скилл' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скилл';
type PaymentType = 'онлайн' | 'при получении'; 

 export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: ProductType;
    price: number | null;
    image: string;
}

export interface IOrderForm {
    payment: PaymentType;
    address: string;
    email: string;
    phone: string;
    total: number;
    productsOrder: TProductBasket[];
    clearForm(): void;
}
 
export interface IProductList {
    products: TProductMain[];
}

export interface IBasket {
    productsBasket: TProductBasket[];
    total: number;
    addProduct(product: TProductBasket): void;
    deleteProduct(productId: string):void;
    clearBasket():void;
}

export type TProductMain = Pick<IProduct, 'id' | 'title' | 'image' | 'category' | 'price'>;

export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TFormPayment = Pick<IOrderForm, 'address' | 'payment'>;

export type TFormContacts = Pick<IOrderForm, 'email' | 'phone'>;