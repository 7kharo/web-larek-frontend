import { ProductType } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component"

interface ICard {

}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected title: HTMLElement;
    protected category: HTMLElement;
    protected image?: HTMLImageElement;
    protected price: HTMLElement;
    protected button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {

        super(container);

        this.title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this.category = container.querySelector(`${blockName}__category`);
        this.price = container.querySelector(`${blockName}__price`);
        this.button = container.querySelector(`${blockName}__button`);

        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    setTitle (value: string): void {

    }
    setCaterory (value: ProductType): void {

    }

    setCardImage (value: string): void {

    }

    setDescription (value: string): void {

    }

    setButtonText (value: string): void {

    }



}