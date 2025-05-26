import { IProduct, ProductType } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryClasses, CDN_URL } from "../../utils/constants"

interface ICard {
    setId (value: string): void;
    setTitle (value: string): void;
    setCategory (value: ProductType): void;
    setCardImage (value: string): void;
    setPrice (value: number): void;
    setDescription (value: string): void;

    getId(): string;
}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected title: HTMLElement;
    protected category?: HTMLElement;
    protected image?: HTMLImageElement;
    protected price: HTMLElement;
    protected button?: HTMLButtonElement;
    protected description?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {

        super(container);

        this.title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        
        this.image = container.querySelector(`.${blockName}__image`);
        this.category = container.querySelector(`.${blockName}__category`);
        this.description = container.querySelector(`.${blockName}__text`);
        this.button = container.querySelector(`.${blockName}__button`);
        
        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    protected setId (value: string): void {
        this.container.dataset.id = value;
    }

    protected setTitle (value: string): void {
        this.setText(this.title, value);
    }

    protected setCategory (value: ProductType): void {
        if (this.category) {
            this.setText (this.category, value);
            this.category.classList.add(categoryClasses[value]);
        }
    }

    protected setCardImage (value: string): void {
        if (this.image) {
            this.setImage(this.image, value);
        }
    }

    protected setPrice (value: number): void {  
        if (!value) {
            this.setText(this.price, 'Бесценно');    
        } else {
            this.setText(this.price, value.toString() + ' синапсов');
        }

        if (this.button) {
            this.button.disabled = !value;
        }
    }

    protected setDescription (value: string): void {
        if (this.description) {
            this.description.textContent = value;
        }
    }

    toggleButtonText (value:boolean): void {
        if (this.button) {
            if (value) {
                this.setText(this.button, 'Убрать из корзины')
            } else {
                this.setText(this.button, 'В корзину')
            }
        }
    }

    renderCard (item: IProduct): HTMLElement {
        this.setPrice(item.price);
        this.setTitle(item.title);
        this.setId(item.id);
        this.setCardImage(item.image);
        this.setCategory(item.category);
        this.setDescription(item.description);
        return this.container;
    }
}