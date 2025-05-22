import { IProduct, ProductType } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryClasses, CDN_URL } from "../../utils/constants"

interface ICardMain {
    setId (value: string): void;
    setTitle (value: string): void;
    setCategory (value: ProductType): void;
    setCardImage (value: string): void;
    setPrice (value: number): void;

    getId(): string;
}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardMain extends Component<ICardMain> {
    protected title: HTMLElement;
    protected category: HTMLElement;
    protected image: HTMLImageElement;
    protected price: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {

        super(container);

        this.title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this.category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this.price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        this.button = container.querySelector(`.${blockName}__button`);
        
        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    setId (value: string): void {
        this.container.dataset.id = value;
    }

    getId (): string {
        return this.container.dataset.id;
    }

    setTitle (value: string): void {
        this.setText(this.title, value);
    }

    setCategory (value: ProductType): void {
        this.setText (this.category, value);
        this.category.classList.add(categoryClasses[value]);
    }

    setCardImage (value: string): void {
        this.setImage(this.image, CDN_URL + value);
    }

    setPrice (value: number): void {  
        if (this.button) {
            if (!value) {
                this.setText(this.price, 'Бесценно');
                this.button.disabled = true;
            } else {
                this.setText(this.price, value.toString() + ' синапсов');
            }
        }
    }

    renderCard (item: IProduct): HTMLElement {
        this.setPrice(item.price);
        this.setTitle(item.title);
        this.setId(item.id);
        this.setCardImage(item.image);
        this.setCategory(item.category);
        return this.container;
    }
}