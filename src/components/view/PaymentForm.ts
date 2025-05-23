import { PaymentType } from "../../types";
import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export interface IPaymentForm {
  address: string;
  payment: PaymentType;
}


export class PaymentForm extends FormView<IPaymentForm> {
  protected online: HTMLButtonElement;
  protected offline: HTMLButtonElement;
  protected address: HTMLInputElement;

  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.online = container.elements.namedItem('card') as HTMLButtonElement;
    this.offline = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this.offline) {
      this.offline.addEventListener('click', () => {
        this.offline.classList.add('button_alt-active')
        this.online.classList.remove('button_alt-active')
        this.onInputChange('payment', 'offline')
      })
    }
    if (this.online) {
      this.online.addEventListener('click', () => {
        this.online.classList.add('button_alt-active')
        this.offline.classList.remove('button_alt-active')
        this.onInputChange('payment', 'online')
      })
    }
  }

  disableButtons() {
    this.offline.classList.remove('button_alt-active')
    this.online.classList.remove('button_alt-active')
  }
}