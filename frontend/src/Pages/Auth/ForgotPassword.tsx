// ForgotPassword.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../../styles/SignUp.css";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RegisterFormInputs } from '../../interface';

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const { passwordResetRequest: passwordResetRequest } = useAuth();
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    const { email } = data;
    try {
      const success = await passwordResetRequest(email, role);
      if (success) {
        setMessage("success");
        navigate("/restaurant/map");
      } else {
        setMessage("failure");
      }
    } catch {
      setMessage("failure");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input {...register("email")} placeholder="Send Email" type="email" className="input-field" />

        <div className="user-type-select">  {/* Add this block for role selection */}
          <button 
              type="button" 
              onClick={() => setRole("customer")} 
              className={role === "customer" ? 'selected' : ''}>
              I'm a Customer
          </button>
          <button 
              type="button" 
              onClick={() => setRole("eatery")} 
              className={role === "eatery" ? 'selected' : ''}>
              I'm a Restaurant Owner
          </button>
        </div>

        <button type="submit" className="submit-button">Send</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;