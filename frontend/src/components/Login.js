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
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (errors.email === '' && errors.password === '') {
      axios
        .post(`${URL}`, values)
        .then((res) => {
          if (res.data === 'Success') {
            navigate('/search');
          } else {
            alert('No record found');
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <div className='login'>
        <h1 className='login_title'>Login</h1>
        <form action='' onSubmit={handleSubmit}>
          <div className='login_email'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Enter email'
              name='email'
              onChange={handleInput}
            />
            {errors.email && (
              <span className='login-signup_error'> {errors.email}</span>
            )}
          </div>
          <div className='login_password'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter password'
              name='password'
              onChange={handleInput}
            />
            {errors.password && (
              <span className='login-signup_error'> {errors.password}</span>
            )}
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
