// SignUp.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../styles/SignUp.css";
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { ResetPassword } from '../interface';


const ResetPassword: React.FC = () => {
  const { register, handleSubmit } = useForm<ResetPassword>();
  const { passwordReset: passwordReset } = useAuth();
  // success or failure to signUp/signIn message shown to client 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { code } = useParams();
  const onSubmit = async (data: ResetPassword) => {
      const { newPassword } = data;
      try {
        const success = await passwordReset(code, newPassword);
        if (success) {
          setMessage("Password reset successful");
          navigate("/auth/home");
        } else {
          setMessage("Failed to reset password");
        }
      } catch {
        setMessage("An error occurred");
      }
  };


  return (
    <div className="signup-container">
      <h2 className="signup-title">Reset Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input {...register("newPassword")} placeholder="Input Password" type="password" className="input-field" />

        <button type="submit" className="submit-button">Send</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword; 