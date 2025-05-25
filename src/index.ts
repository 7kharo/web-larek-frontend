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
import { PaymentForm } from './components/view/PaymentForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Sucsess';
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

// Обработка изменения состава корзины
events.on ('basket: change', () => {
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
    events.emit('basket: change');
});

// Обработка клика по иконке удаления товара из корзины
events.on('basket: delete', (item: IProduct) => {
    basket.deleteProduct(item.id);
    events.emit('basket: change');
});

// Обработка клика по кнопке "Оформить" для заказа товаров из корзины
events.on('basket: order', () => {
    modal.render({
    content: paymentForm.render(
      {
        address: '',
        valid: false,
        errors: ''
      }
    ),
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




    // page.setCatalog(domCards);
    // const previewCard = new Card ('card', cloneTemplate(cardPreviewTemplate));
    // modal.render({content: previewCard.renderCard(items[2])});

    // Валидация

    // events.on('order: change', () => {
    //     const { email, phone } = form.validateOrder();
    //     const valid = !email && !phone;
    //     const errors = Object.values({ phone, email }).filter((i) => !!i).join('; ');

    //     PaymentForm.render({
    //         email: form.getFormFields().email,
    //         phone: form.getFormFields().phone,
    //         valid: valid,
    //         errors: errors,
    //     })
    // })


