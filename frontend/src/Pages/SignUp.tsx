// SignUp.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../styles/SignUp.css";
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { RegisterFormInputs } from '../interface';


const SignUp: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const [role, setRole] = useState<string>("");
  const { register: registerUser } = useAuth();
  // success or failure to signUp/signIn message shown to client 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    // Update this to include userType from state, not from form
    const { name, email, password } = data
    try { 
      const success = await registerUser(email, password, name, role);
      if (success) { 
        setMessage("success"); 
        navigate("/auth/home"); 
      } else { 
        setMessage("failure"); 
      }
    } catch { 
      setMessage("failure"); 
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create an account or&nbsp;
        <div onClick={() => navigate("/auth/login")} className='title-link'>log in</div>
      </h2>
      <p className="signup-sub-title">Create a new account below or log in</p>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input {...register("name")} placeholder="Name" className="input-field" />
        <input {...register("email")} placeholder="Email" type="email" className="input-field" />
        <input {...register("password")} placeholder="Password" type="password" className="input-field" />


        <div className="user-type-select">
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
              I'm a Resturant Owner
          </button>
        </div>

        {role === "eatery" && <input {...register("address")} placeholder="Restaurant Address" className="input-field" />}

        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp; 