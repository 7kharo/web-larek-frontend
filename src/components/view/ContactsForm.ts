import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export interface IContacts {
  phone: string;
  email: string;
}

export class ContactsForm extends FormView<IContacts> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}