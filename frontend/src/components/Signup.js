import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

const Signup = () => {
  const URL = 'http://localhost:8081/signup';
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (errors.name === '' && errors.email === '' && errors.password === '') {
      axios
        .post(`${URL}`, values)
        .then((res) => {
          navigate('/login');
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <div className='signup'>
        <h1 className='signup_title'>Sign Up</h1>
        <form action='' onSubmit={handleSubmit}>
          <div className='signup_name'>
            <label htmlFor='name'>Name</label>
            <input
              type='name'
              placeholder='Enter name'
              name='name'
              onChange={handleInput}
            />
            {errors.name && (
              <span className='login-signup_error'> {errors.name}</span>
            )}
          </div>
          <div className='signup_email'>
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
          <div className='signup_password'>
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
          <button type='submit' className='btn btn_sign-up btn_signup-form'>
            Sign up
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
