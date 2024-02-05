import React from 'react';

const Login = () => {
  return (
    <div>
      <div className='login'>
        <form action=''>
          <div className='login_email'>
            <label htmlFor='email'>Email</label>
            <input type='email' placeholder='Enter email' />
          </div>
          <div className='login_password'>
            <label htmlFor='password'>Password</label>
            <input type='password' placeholder='Enter password' />
          </div>
          <button className='btn btn_log-in'>Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
