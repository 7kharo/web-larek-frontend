import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  description: number;
}

export class Success extends Component<ISuccess> {
  protected button: HTMLButtonElement;
  protected description: HTMLElement;

  constructor(protected container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.button = container.querySelector('.order-success__close');
    this.description = container.querySelector('.order-success__description');

    if (actions?.onClick) {
      if (this.button) {
        this.button.addEventListener('click', actions.onClick)
      }
    }
  }

  setDescription(value: number): void {
    this.description.textContent = `Списано ${value.toString()} синапсов`;
  }
}