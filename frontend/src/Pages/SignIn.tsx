// SignIn.tsx
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import "../styles/SignUp.css"
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignInFormInputs } from '../interface';

const SignIn: React.FC = () => {
  const { register, handleSubmit } = useForm<SignInFormInputs>();
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const onSubmit = async (data: SignInFormInputs) => {
    const { email, password } = data;

    try {
      const success = await login(email, password);
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
      <h2 className="signup-title">Welcome Back</h2>
      <p className="signup-sub-title">Sign in to your account or&nbsp;
        <div onClick={() => navigate("/auth/register")} className='title-link'>Sign Up</div>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input {...register("email")} placeholder="Email" type="email" className="input-field" />
        <input {...register("password")} placeholder="Password" type="password" className="input-field" />

        <button type="submit" className="submit-button">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
