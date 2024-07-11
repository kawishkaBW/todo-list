import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Nav';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./Login.css"

const Password = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input 
        type={showPassword ? "text" : "password"}
        placeholder="Password" 
        className="input-box" 
        value={value}
        onChange={onChange}
      />
      <span
        onClick={togglePasswordVisibility}
        className="absolute transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setTimeout(() => setError(null), 1000);
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setTimeout(() => setError(null), 1000);
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-full max-w-sm py-10 border rounded-2xl px-7 login-container'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl text-center mb-7'>Login</h4>
            <input 
              type="text" 
              placeholder='E-mail' 
              className='input-box' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Password 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {error && <p className='justify-center mt-2 text-sm text-center text-red-500'>{error}</p>}
            <button type='submit' className='w-full mt-4 btn-primary'>
              Login
            </button>
            <p className='mt-4 text-sm text-center'>
              Not registered yet?{' '}
              <Link to="/signup" className='font-medium underline text-primary'>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
