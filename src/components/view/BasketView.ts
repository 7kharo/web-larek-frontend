import { IProduct } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.total = this.container.querySelector('.basket__price');
        this.button = this.container.querySelector('.basket__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('basket: order');
            });
        }
    }

    setItems(items: HTMLElement[]) {
        if (items.length) {
            this.list.replaceChildren(...items);
            this.button.disabled = false;
        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.button.disabled = true;
        }
    }

    setIndex(items: HTMLElement[]) {
        items.forEach((item, index) => {
            item.querySelector('.basket__item-index').textContent = (index+1).toString();
        })
    }

    disableButton() {
        this.button.disabled = true;
    }

    setTotalPrice(total: number) {
        this.setText(this.total, `${total.toString()} синапсов`);
    }

    renderBasket (items:HTMLElement[], total: number) {
        this.setItems(items);
        this.setTotalPrice(total);
        this.setIndex(items);
        return this.container
    }
}