import React, { useState } from "react";
import "./Auth.css";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.post("http://localhost:5000/api/auth/register", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      toast.success("Registration successful!");
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="logo-section"><span>LOGO</span></div>

      <div className="auth-card">
        <div className="auth-left">
          <img src="/dashboard-preview.png" alt="Dashboard" className="auth-img" />
          <p className="auth-title">Lorem ipsum dolor sit amet...</p>
          <p className="auth-desc">tempor incididunt ut labore...</p>
          <div className="dot-indicators">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="auth-right">
          <h2>Welcome to Dashboard</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <label>Full Name<span>*</span></label>
            <input
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Full name must not exceed 30 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Only letters and spaces are allowed",
                }
              })}
              placeholder="Full Name"
            />
            {errors.fullName && <p className="error">{errors.fullName.message}</p>}

            <label>Email Address<span>*</span></label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Email must be a valid @gmail.com address",
                },
              })}
              placeholder="Email Address"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <label>Phone Number<span>*</span></label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              placeholder="Phone Number"
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}

            <label>Password<span>*</span></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                    message: "Password must contain 1 capital, 1 special character, and be at least 8 characters long",
                  },
                })}
                placeholder="Password"
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {errors.password && <p className="error">{errors.password.message}</p>}

            <label>Confirm Password<span>*</span></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                placeholder="Confirm Password"
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="login-link">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
