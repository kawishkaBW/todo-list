import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Nav";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUp.css"

const Password = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter a valid name.");
      setTimeout(() => setError(null), 1500);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setTimeout(() => setError(null), 1500);
      return;
    }

    if (!password) {
      setError("Please Enter Your Password");
      setTimeout(() => setError(null), 1500);
      return;
    }

    if (!confirmPassword) {
      setError("Please Enter Your Password");
      setTimeout(() => setError(null), 1500);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setTimeout(() => setError(null), 2000);
      return;
    }

    setError("");

    // Sign-up logic
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }

    } catch (error) {
      // Handle errors
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-20">
        <div className="py-10 bg-white w-96 px-7 sign-up-container">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="e-mail"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />

            {error && (
              <p className="mt-2 text-sm text-center text-red-500">{error}</p>
            )}

            <button type="submit" className="btn-primary">
              Sign Up
            </button>

            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <Link to="/" className="font-medium underline text-primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;