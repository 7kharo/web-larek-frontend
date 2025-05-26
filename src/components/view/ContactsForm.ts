import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export interface IContactsForm {
  phone: string;
  email: string;
}

export class ContactsForm extends FormView<IContactsForm> {
  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
  }
}