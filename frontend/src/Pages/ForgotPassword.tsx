
// ResetPassword.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignInFormInputs } from '../interface';
import "../styles/SignUp.css"

const ResetPassword: React.FC = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<SignInFormInputs>();
  const [role, setRole] = useState<"customer" | "eatery">("customer");
  const [message, setMessage] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { passwordResetRequest, passwordReset } = useAuth();
  const navigate = useNavigate();

  const handlePasswordResetRequest = async (data: SignInFormInputs) => {
    const { email } = data;
    const result = await passwordResetRequest(email, role);
    if (result) {
      setMessage(`Email sent to '${email}' from a '${role}'`)
    } else {
      setMessage(`Failure to email '${email}' from a '${role}'`)
    }
  };

  const handlePasswordReset = async () => {
    const result = await passwordReset(resetCode, newPassword);
    if(result) {
      navigate('/auth/signin'); // assuming this is your signin route
    } else {

// ForgotPassword.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../styles/SignUp.css";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RegisterFormInputs } from '../interface';

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const { passwordResetRequest: passwordResetRequest } = useAuth();
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string>("");  // add role state
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    const { email, } = data;
    try {
      const success = await passwordResetRequest(email, role);  // include role in function call
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
    <div className='forgot-password-container'>
      <span className="forgot-password-sub-title">Forgot Password</span>
      <form onSubmit={handleSubmit(handlePasswordResetRequest)} className="signup-form">
        <input {...register("email")} placeholder="Email" type="email" className='input-field'/>
        <div className="user-type-select">
          <button 
            type="button" 
            className={role === "customer" ? 'selected' : ''}
            onClick={() => { 
              setRole("customer")
              setValue("role", role)
            }}> I'm a Customer
          </button>
          <button 
            type="button" 
            className={role === "eatery" ? 'selected' : ''}
            onClick={() => {
              setRole("eatery")
              setValue("role", "eatery")
            }}> I'm a Resturant Owner
          </button>
        </div>
        <input type="text" onChange={(e) => setResetCode(e.target.value)} placeholder="Enter Reset Code" className='input-field'/>
        <button type="submit" className='submit-button'style={{"background":"#E07893", "border": "none"}}>Send Code</button>
        
        <input type="password" onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className='input-field'/>
        <button onClick={handlePasswordReset} className='submit-button' style={{"background":"#E07893", "border": "none"}}>Reset Password</button>
        
        <div onClick={() => navigate("/auth/register")} className='title-link'>Sign In</div>
        {message}
     </form>
  );
};
export default ResetPassword;
