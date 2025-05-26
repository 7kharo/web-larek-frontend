import { IEvents } from '../base/events';
import { PaymentType, IForm, FormErrors } from '../../types';

export class FormData {
    protected formFields: IForm = {
        payment: '',
        address: '',
        email: '',
        phone: '',
    };
    protected formErrors: FormErrors = {};
    
    constructor (protected events: IEvents) {}

    getFormFields(): IForm {
        return this.formFields;
    }

    setFormField<T extends keyof IForm>(field: T, value: IForm[T]): void {
        this.formFields[field] = value;
        this.events.emit ('form: changed', {field: field});
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.formFields.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.formFields.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.formFields.payment) {
            errors.payment = 'Необходимо указать тип оплаты';
        }
        if (!this.formFields.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        return errors
    }

    clearForm () {
        this.formFields = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        };
        this.events.emit ('form: changed');
    }

}