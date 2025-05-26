import { PaymentType } from "../../types";
import { IEvents } from "../base/events";
import { FormView, IFormState } from "./FormView";

export interface IPaymentForm {
  address: string;
  payment: PaymentType;
}


export class PaymentForm extends FormView<IPaymentForm> {
  protected online: HTMLButtonElement;
  protected offline: HTMLButtonElement;
  protected address: HTMLInputElement; 

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.online = container.elements.namedItem('card') as HTMLButtonElement;
    this.offline = container.elements.namedItem('cash') as HTMLButtonElement;
    this.address = container.elements.namedItem('address') as HTMLInputElement;

    if (this.offline) {
      this.offline.addEventListener('click', () => {
        this.onInputChange('payment', 'offline')
      })
    }
    if (this.online) {
      this.online.addEventListener('click', () => {
        this.onInputChange('payment', 'online')
      })
    }
  }

  protected togglePaymentButton (value: PaymentType): void {
    if (value === 'online') {
      this.online.classList.add('button_alt-active');
      this.offline.classList.remove('button_alt-active');
    } else {
      if (value === 'offline') {
        this.offline.classList.add('button_alt-active');
        this.online.classList.remove('button_alt-active');
      } else {
        this.offline.classList.remove('button_alt-active');
        this.online.classList.remove('button_alt-active');
      }
    }
  }

  render(state?: Partial<IPaymentForm> & IFormState): HTMLFormElement {
    super.render(state);

    if (state) {
      if (state.payment) {
        this.togglePaymentButton(state.payment);
      }
    }
    return this.container;
  }
}