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

export interface IForm {
    payment: PaymentType;
    address: string;
    email: string;
    phone: string;
    clearForm(): void;
}
 
export interface IProductList {
    products: TProductMain[];
}

export interface IBasket {
    productsBasket: TProductBasket[];
    addProduct(product: TProductBasket): void;
    deleteProduct(productId: string):void;
    clearBasket():void;
}

export type TProductMain = Pick<IProduct, 'id' | 'title' | 'image' | 'category' | 'price'>;

export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TFormPayment = Pick<IForm, 'address' | 'payment'>;

export type TFormContacts = Pick<IForm, 'email' | 'phone'>;