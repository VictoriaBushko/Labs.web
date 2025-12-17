import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/actions';
import { selectCartItems, selectCartTotal } from '../redux/selectors';
import PrimaryButton from '../components/ui/PrimaryButton';
import FormError from '../components/ui/FormError';
import api from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const HEADER_HEIGHT = 72;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Ім'я обов'язкове для заповнення")
    .min(2, "Ім'я має містити принаймні 2 символи")
    .max(50, "Ім'я не може перевищувати 50 символів")
    .matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s'-]+$/, "Ім'я може містити тільки літери, апострофи та дефіси"),
  
  lastName: Yup.string()
    .required("Прізвище обов'язкове для заповнення")
    .min(2, "Прізвище має містити принаймні 2 символи")
    .max(50, "Прізвище не може перевищувати 50 символів")
    .matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s'-]+$/, "Прізвище може містити тільки літери, апострофи та дефіси"),
  
  email: Yup.string()
    .required("Email обов'язковий для заповнення")
    .email("Введіть коректний email адрес")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Email повинен містити @ та домен з мінімум 2 літерами після крапки"
    ),
  
  phone: Yup.string()
    .required("Телефон обов'язковий для заповнення")
    .matches(/^\+?\d{10,15}$/, "Телефон має містити від 10 до 15 цифр")
    .matches(/^[\d\s\+\-\(\)]+$/, "Телефон може містити тільки цифри, пробіли та символи + - ( )"),
  
  address: Yup.string()
    .required("Адреса обов'язкова для заповнення")
    .min(10, "Адреса має містити принаймні 10 символів")
    .max(200, "Адреса не може перевищувати 200 символів")
    .matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ0-9\s\.,-]+$/, "Адреса може містити тільки літери, цифри, пробіли та символи . , -"),
  
  paymentMethod: Yup.string()
    .required("Оберіть спосіб оплати"),
  
  termsAccepted: Yup.boolean()
    .oneOf([true], "Ви маєте погодитись з умовами")
});

const Checkout = () => {
  const { user, saveUserData, getUserData } = useAuth();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  
  const getInitialValues = () => {
    if (user?.email) {
      const savedData = getUserData(user.email);
      if (savedData) {
        return {
          firstName: savedData.firstName || '',
          lastName: savedData.lastName || '',
          email: savedData.email || user.email || '',
          phone: savedData.phone || '',
          address: savedData.address || '',
          paymentMethod: savedData.paymentMethod || '',
          termsAccepted: savedData.termsAccepted || false
        };
      }
    }
    
    return {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      paymentMethod: '',
      termsAccepted: false
    };
  };

  const initialValues = getInitialValues();
  
  useEffect(() => {
    const savedAddress = localStorage.getItem('currentAddress');
    if (savedAddress) {
      setCurrentAddress(savedAddress);
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      await api.get('/button-click?button=checkout_submit');
      
      console.log('Form submitted:', values);
      console.log('Order items:', cartItems);
      console.log('Order total:', cartTotal);
      
      if (user?.email) {
        saveUserData(user.email, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          paymentMethod: values.paymentMethod
        });
      }
      
      dispatch(clearCart());
      
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/success', { state: { orderData: values, cartItems, cartTotal } });
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('Помилка при відправці форми. Спробуйте ще раз.');
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleBackToCart = async () => {
    try {
      await api.get('/button-click?button=back_to_cart_from_checkout');
    } catch (error) {
      console.error('Error sending back to cart click:', error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="container checkout-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
        <div className="checkout-empty">
          <h2>Ваш кошик порожній</h2>
          <p>Додайте товари в кошик перед оформленням замовлення</p>
          <Link to="/catalog">
            <PrimaryButton>Повернутись до каталогу</PrimaryButton>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container checkout-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
      <h1>Оформлення замовлення</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Ваше замовлення</h2>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.uniqueId} className="order-item">
                <div className="order-item-info">
                  <span className="order-item-name">{item.title}</span>
                  {item.selectedOption && item.selectedOption !== 'A' && (
                    <span className="order-item-option"> ({item.selectedOption})</span>
                  )}
                  <span className="order-item-quantity">× {item.quantity}</span>
                </div>
                <div className="order-item-price">
                  ${(getNumericPrice(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Загальна сума:</span>
            <span className="total-amount">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-form">
          <h2>Контактна інформація</h2>
          
          {formError && <div className="form-global-error">{formError}</div>}
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ errors, touched, isSubmitting: formikSubmitting, values }) => (
              <Form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Ім'я *</label>
                    <Field 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      className={touched.firstName && errors.firstName ? 'error' : ''}
                    />
                    <ErrorMessage name="firstName" component={FormError} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Прізвище *</label>
                    <Field 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      className={touched.lastName && errors.lastName ? 'error' : ''}
                    />
                    <ErrorMessage name="lastName" component={FormError} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <Field 
                      type="email" 
                      id="email" 
                      name="email"
                      className={touched.email && errors.email ? 'error' : ''}
                    />
                    <ErrorMessage name="email" component={FormError} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <Field 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      placeholder="+380123456789"
                      className={touched.phone && errors.phone ? 'error' : ''}
                    />
                    <ErrorMessage name="phone" component={FormError} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Адреса доставки *</label>
                  <Field 
                    as="textarea" 
                    id="address" 
                    name="address"
                    rows="3"
                    onBlur={(e) => {
                      const newAddress = e.target.value;
                      if (newAddress && newAddress !== currentAddress) {
                        setCurrentAddress(newAddress);
                        localStorage.setItem('currentAddress', newAddress);
                      }
                    }}
                    className={touched.address && errors.address ? 'error' : ''}
                  />
                  <ErrorMessage name="address" component={FormError} />
                </div>

                <div className="form-group">
                  <label htmlFor="paymentMethod">Спосіб оплати *</label>
                  <Field 
                    as="select" 
                    id="paymentMethod" 
                    name="paymentMethod"
                    className={touched.paymentMethod && errors.paymentMethod ? 'error' : ''}
                  >
                    <option value="">Оберіть спосіб оплати</option>
                    <option value="credit_card">Кредитна карта</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Банківський переказ</option>
                    <option value="cash_on_delivery">Готівка при отриманні</option>
                  </Field>
                  <ErrorMessage name="paymentMethod" component={FormError} />
                </div>

                <div className="form-group checkbox-group">
                  <Field 
                    type="checkbox" 
                    id="termsAccepted" 
                    name="termsAccepted"
                  />
                  <label htmlFor="termsAccepted">
                    Я погоджуюсь з <a href="/terms">умовами обробки даних</a> та <a href="/privacy">політикою конфіденційності</a>
                  </label>
                  <ErrorMessage name="termsAccepted" component={FormError} />
                </div>

                <div className="checkout-buttons">
                  <Link to="/cart">
                    <PrimaryButton type="button" onClick={handleBackToCart}>
                      Повернутись до кошика
                    </PrimaryButton>
                  </Link>
                  
                  <PrimaryButton 
                    type="submit" 
                    disabled={isSubmitting || formikSubmitting}
                    className={isSubmitting ? 'loading' : ''}
                  >
                    {isSubmitting ? 'Обробка...' : 'Оформити замовлення'}
                  </PrimaryButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

function getNumericPrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  return 0;
}

export default Checkout;