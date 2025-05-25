import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPage {
    setCounter(value: number): void;
    setCatalog(cards: HTMLElement []): void;
    setLocked(locked: boolean):void;
}

export class Page extends Component<IPage> {
    protected counter: HTMLElement;
    protected gallery: HTMLElement;
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);

        this.counter = ensureElement<HTMLElement>('.header__basket-counter');
        this.gallery = ensureElement<HTMLElement>('.gallery');
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');

        this.basket.addEventListener('click', () => {
            this.events.emit('basket: open');
        });
    }

    setCounter(value: number): void {
        this.setText (this.counter, value);
    }

    setCatalog(cards: HTMLElement []): void {
        this.gallery.replaceChildren (...cards);
    }

    setLocked(locked: boolean):void {
        if (locked) {
            this.wrapper.classList.add ('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove ('page__wrapper_locked');
        }
    }
}