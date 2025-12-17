import React from 'react';
import './FormError.css';

const FormError = ({ children }) => {
  return <div className="form-error">{children}</div>;
};

export default FormError;