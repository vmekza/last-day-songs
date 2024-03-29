import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

const Login = () => {
  const URL = 'http://localhost:8081/login';
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    // Check if there are no errors directly from the validation result
    if (!validationErrors.email && !validationErrors.password) {
      try {
        const res = await axios.post(URL, values);
        if (res.data === 'Success') {
          navigate('/search');
        } else {
          alert('No record found');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className='login'>
        <h1 className='login_title'>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='login_email'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Enter email'
              name='email'
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <span className='login-signup_error'>{errors.email}</span>}
          </div>
          <div className='login_password'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter password'
              name='password'
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && <span className='login-signup_error'>{errors.password}</span>}
          </div>
          <button type='submit' className='btn btn_login btn_login-form'>
            Log in
          </button>
        </form>
      </div>
    </>
  );


};

export default Login;
