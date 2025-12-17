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
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        await api.get('/button-click?button=login_success');
        navigate('/');
      } else {
        setFormError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <h2>Sign In</h2>
            <p>Sign in to your account to continue</p>
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
                </div>

                <div className="auth-footer">
                  <PrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? 'loading' : ''}
                  >
                    {isSubmitting ? 'Signing in...' : 'LOG ME IN'}
                  </PrimaryButton>

                  <p className="auth-switch">
                    Not a member? <Link to="/register">Sign up</Link>
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

export default Login;