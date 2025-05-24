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

  constructor(protected blockName: string, container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.button = container.querySelector(`.${blockName}__close`);
    this.description = container.querySelector(`.${blockName}__description`);

    if (actions?.onClick) {
      if (this.button) {
        this.button.addEventListener('click', actions.onClick)
      }
    }
  }

  setDescription(value: number) {
    this.description.textContent = `Списано ${value.toString()} синапсов`;
  }
}