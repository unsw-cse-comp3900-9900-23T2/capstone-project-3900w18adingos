// SignIn.tsx
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import "../styles/SignUp.css"
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignInFormInputs } from '../interface';

const SignIn: React.FC = () => {
  const { register, handleSubmit } = useForm<SignInFormInputs>();
  
  const [toggleResetPasswordOptions, setToggleResetPasswordOptions] = useState(false);
  const { user, passwordResetRequest, passwordReset } = useAuth();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordResetRequest = async (data: SignInFormInputs) => {
    const {email} = data;
    if (!email) { 
      setMessage("please enter email in first input box"); 
    } else if (!role) { 
      setMessage("please select a role - Customer or Resturant Owner?"); 
    } else { 
      console.log(email + " " + role)
      const result = await passwordResetRequest(email, role);
    }
  };
  
  const handlePasswordReset = async () => {
    const result = await passwordReset(resetCode, newPassword);
    if (result) {
    }
  };
  
  const onSubmit = async (data: SignInFormInputs) => {
    const { email, password } = data;
    try {
      const success = await login(email, password, role);
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

        {!toggleResetPasswordOptions && 
          <button type="submit" className="submit-button">Sign In</button>
        }
        
        {toggleResetPasswordOptions &&
          <div className="toggle-reset-password-container">
              <input type="text" onChange={(e) => setResetCode(e.target.value)} className='input-field' placeholder="Enter Reset Code" />
              <button onClick={handleSubmit(handlePasswordResetRequest)} className='reset-button'>Send Code</button>

              <input type="password" onChange={(e) => setNewPassword(e.target.value)} className='input-field' placeholder="New Password" />
              <button onClick={handlePasswordReset}className='reset-button' >Reset Password</button>
            </div>
          }

        <div className='forgot-password' onClick={() => {setToggleResetPasswordOptions(!toggleResetPasswordOptions)}}>
          <p className='forgot-password-text'>forgot password</p>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
