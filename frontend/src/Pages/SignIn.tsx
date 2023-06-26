// SignIn.tsx
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import "../styles/SignUp.css"
import { useAuth } from '../useAuth';

interface FormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  
  const onSubmit = async (data: FormInputs) => {
    const { email, password } = data;

    try {
      const success = await login(email, password);
      if (success) { 
        setMessage("success"); 
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
      <p className="signup-sub-title">Sign in to your account</p>
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
