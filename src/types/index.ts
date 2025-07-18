export type ProductType = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type PaymentType = 'online' | 'offline' | ''; 
export type FormErrors = Partial<Record<keyof IForm, string>>;
export type CategoryClassesType = {
  [Key in ProductType]: string;
};
export interface ApiResponse {
    total: number;
    items: IProduct[],
}

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
}

export interface IOrder extends IForm {
    items: string[]
    total: number;
}
 
export interface IProductList {
    items: IProduct[];
}

export interface IBasket {
    productsBasket: IProduct[];
}

export interface IOrderResult {
    id: string;
    total: number;
}
