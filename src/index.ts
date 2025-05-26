import './scss/styles.scss';

import { Basket } from './components/model/Basket';
import { FormData } from './components/model/FormData';
import { ProductList } from './components/model/ProductList';
import { IEvents, EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { Page } from './components/view/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/view/Card';
import { Modal } from './components/view/Modal';
import { IPaymentForm, PaymentForm } from './components/view/PaymentForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/model/AppApi';
import { BasketView } from './components/view/BasketView';

// Экземпляры базовых объектов
const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//DOM-элементы
const modalElement = ensureElement<HTMLElement>('#modal-container');
const pageElement = document.querySelector('.page') as HTMLElement;
const paymentFormElement = paymentFormTemplate.content.querySelector('.form') as HTMLFormElement;
const contactsFormElement = contactsFormTemplate.content.querySelector('.form') as HTMLFormElement;
const successElement = successTemplate.content.querySelector('.order-success') as HTMLFormElement;

// Экземпляры объектов модели данных приложения
const form = new FormData(events);
const productList = new ProductList (events);
const basket = new Basket (events);

// Экземпляры глобальных объектов отображения 
const page = new Page(pageElement, events);
const modal = new Modal(modalElement, events);

// Экземпляры объектов отображения
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const paymentForm = new PaymentForm(paymentFormElement, events);
const contactsForm = new ContactsForm(contactsFormElement, events);
const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
});

// Обработка события изменения списка карточек с товарами
events.on('productList: change', () => {
  page.setCatalog(productList.getProducts().map((item) => {
    const product = new Card ('card', cloneTemplate(cardTemplate), {
      onClick: () => events.emit('product: preview', item),
    });
    return product.renderCard(item);
  }));
});

// Обработка клика по карточке (открытие полного описания товара)
events.on('product: preview', (item: IProduct) => {
    page.setLocked(true);
    const previewCard = new Card ('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basket.isProductIn(item.id)) {
                events.emit('product: deleteFromBasket', item);
            } else {
                events.emit('product: addToBasket', item);
            }
        }
    });
    previewCard.toggleButtonText(basket.isProductIn(item.id));
    modal.render({content: previewCard.renderCard(item)});
});

// Обработка клика по добавления товара в корзину на превью карточки
events.on('product: addToBasket', (item: IProduct) => {
    basket.addProduct(item);
    page.setCounter(basket.getItemsCount());
    const previewCard = new Card ('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('product: deleteFromBasket', item);
        }
    });
    previewCard.toggleButtonText(basket.isProductIn(item.id));
    modal.render({content: previewCard.renderCard(item)});
});

// Обработка клика по удалению товара из корзины на превью карточки
events.on('product: deleteFromBasket', (item: IProduct) => {
    basket.deleteProduct(item.id);
    page.setCounter(basket.getItemsCount());
    const previewCard = new Card ('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('product: addToBasket', item);
        }
    });
    previewCard.toggleButtonText(basket.isProductIn(item.id));
    modal.render({content: previewCard.renderCard(item)});
});

// Рендер при изменении или открытии корзины
events.on ('basket: render', () => {
    const basketItems = basket.getBasketProducts().map((item: IProduct) => {
        const basketItem = new Card('card', cloneTemplate(cardBasketTemplate), {
                onClick: () => {
                    events.emit('basket: delete', item);
                }
            });
        return basketItem.renderCard(item);
    });
    modal.render({
        content: basketView.renderBasket(basketItems, basket.getTotalSum())
    });
})

// Обработка клика по иконке корзины для открытия корзины
events.on('basket: open', () => {
    page.setLocked(true);
    events.emit('basket: render');
});

// Обработка клика по иконке удаления товара из корзины
events.on('basket: delete', (item: IProduct) => {
    basket.deleteProduct(item.id);
    events.emit('basket: render');
});

// Обработка клика по кнопке "Оформить" для заказа товаров из корзины
events.on('basket: order', () => {
    modal.render({content: paymentForm.render()});
});

// Обработка изменения полей формы с выбором оплаты
events.on(/^order\..*: change/, (data: { field: keyof IPaymentForm, value: string }) => {
    form.setFormField(data.field, data.value);
});

// Обработка изменения полей формы с контактами
events.on(/^contacts\..*: change/, (data: { field: keyof IPaymentForm, value: string }) => {
    form.setFormField(data.field, data.value);
});


// Обработка изменений данных формы и вывод уже измененных данных на странице
events.on('form: changed', () => {
    const { payment, address, email, phone } = form.validateOrder();
    
    let errorsPayment: string;
    let errorsContacts: string;
    
    if (!payment || !address) {
        errorsPayment = Object.values({ payment, address }).filter((i) => !!i).join('; ');
    } else {
        errorsPayment = '';
    }

    if (!email || !phone) {
        errorsContacts = Object.values({ email, phone }).filter((i) => !!i).join('; ');
    } else {
        errorsContacts = '';
    }
    
    const validContacts = !email && !phone;
    const validPayment = !payment && !address;
    // const errorsPayment = Object.values({ payment, address }).filter((i) => !!i).join('; ');
    // const errorsContacts = Object.values({ email, phone }).filter((i) => !!i).join('; ');
    paymentForm.render(
        {
            payment: form.getFormFields().payment,
            address: form.getFormFields().address,
            valid: validPayment,
            errors: errorsPayment,
        }
    )

    contactsForm.render(
        {
            email: form.getFormFields().email,
            phone: form.getFormFields().phone,
            valid: validContacts,
            errors: errorsContacts,
        }
    )
});


// Обработка клика по кнопке "Далее" для ввода контактных данных
events.on('order: submit', () => {
    modal.render({content: contactsForm.render()});
});

// Обработка оформления товаров по кнопке "Оформить" в модальном окне с контактами
events.on('contacts: submit', () => {
    const formData = form.getFormFields();
    const productsId = basket.getBasketProducts().map((item) => {
        return item.id;
    })
    const orderObject = {
        ...formData,
        total: basket.getTotalSum(),
        items: productsId,
    }
    api.orderProducts(orderObject)
        .then((res) => {
            basket.clearBasket();
            page.setCounter(basket.getItemsCount());
            success.setDescription(orderObject.total);
            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
})


// Обработка закрытия модального окна
events.on('modal:close', () => {
  page.setLocked(false);
});


// Получаем лоты с сервера
api.getProductList()
    .then(productList.setProducts.bind(productList))
    .catch(err => {
        console.error(err);
    });

form.clearForm();
