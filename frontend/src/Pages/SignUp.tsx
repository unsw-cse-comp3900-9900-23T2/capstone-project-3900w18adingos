// SignUp.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import "../styles/SignUp.css"

interface FormInputs {
  name: string;
  email: string;
  password: string;
  userType: string;
  address?: string;
}

const SignUp: React.FC = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  // success or failure to signUp/signIn message shown to client 
  const [message, setMessage] = useState("");

  const onSubmit = async (data: FormInputs) => {
    // Update this to include userType from state, not from form
    const { name, email, password, address } = data;
    const userType = selectedUserType;

    const payload = {
      name,
      email,
      password,
      userType,
      address,
    };

    try {
      const response = await axios.post('http://localhost:5000/signup', payload);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create an account or log in</h2>
      <p className="signup-sub-title">Create a new account below or log in</p>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input {...register("name")} placeholder="Name" className="input-field" />
        <input {...register("email")} placeholder="Email" type="email" className="input-field" />
        <input {...register("password")} placeholder="Password" type="password" className="input-field" />


        <div className="user-type-select">
          <button 
              type="button" 
              onClick={() => setSelectedUserType('user')} 
              className={selectedUserType === 'user' ? 'selected' : ''}>
              I'm a Customer
          </button>
          <button 
              type="button" 
              onClick={() => setSelectedUserType('owner')} 
              className={selectedUserType === 'owner' ? 'selected' : ''}>
              I'm a Resturant Owner
          </button>
        </div>

        {selectedUserType === 'owner' && <input {...register("address")} placeholder="Restaurant Address" className="input-field" />}

        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;
