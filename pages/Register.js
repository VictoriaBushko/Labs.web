import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from '../components/ui/PrimaryButton';
import api from '../api/apiService';
import './Auth.css';

const HEADER_HEIGHT = 72;

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: Yup.string()
  .required('Email is required')
  .email('Invalid email format')
  .matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    'Email must contain @ and domain with at least 2 letters after dot'
  ),
  
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const result = await register(values.username, values.email, values.password);
      
      if (result.success) {
        await api.get('/button-click?button=register_success');
        navigate('/');
      } else {
        setFormError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <main className="container auth-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Register New Account</h2>
            <p>Create your account to get started</p>
          </div>

          {formError && (
            <div className="auth-error">
              {formError}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    className={touched.username && errors.username ? 'error' : ''}
                  />
                  <ErrorMessage name="username" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className={touched.email && errors.email ? 'error' : ''}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className={touched.password && errors.password ? 'error' : ''}
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                  <div className="password-hint">
                    Must be at least 6 characters with letters, numbers, and special characters
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Repeat Password *</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>

                <div className="auth-footer">
                  <PrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? 'loading' : ''}
                  >
                    {isSubmitting ? 'Creating account...' : 'SIGN ME UP'}
                  </PrimaryButton>

                  <p className="auth-switch">
                    Already member? <Link to="/login">Sign in</Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default Register;