import React, { useState, FormEvent} from 'react';
import axios from 'axios';
import "../styles/CuisineForm.css"
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';


// Select 5 


const commonCuisines: string[] = [
  'Italian', 'Chinese', 'Indian', 'Mexican', 'French', 
  'Japanese', 'Spanish', 'Greek', 'Lebanese', 'Brazilian',
  'Vietnamese', 'Moroccan', 'Korean', 'American', 'Turkish', 
  'Thai', 'Russian', 'Mediterranean'
];

export const CuisineForm: React.FC = () => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const navigate = useNavigate()
  
  const handleButtonClick = (value: string) => {
    setSelectedCuisines(prevCuisines => 
      prevCuisines.includes(value)
        ? prevCuisines.filter(cuisine => cuisine !== value)
        : prevCuisines.length < 5 ? [...prevCuisines, value] : prevCuisines
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const api = axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });
    
    api.post('/api/add_preferences', {
      cuisines: selectedCuisines,
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));

    navigate("/auth/home");
  };

  return (
    <>
      <Header>
        <h2>Select 5 Prefered Cuisines</h2>
      </Header>
      <div>
        <form onSubmit={handleSubmit} className='cuisine-form'>
          {commonCuisines.map(cuisine => (
            <button 
              key={cuisine}
              type="button"
              className={selectedCuisines.includes(cuisine) ? 'cuisine-item selected' : 'cuisine-item'}
              onClick={() => handleButtonClick(cuisine)}
            >
              {cuisine}
            </button>
          ))}
          <button 
            type="submit" 
            className='submit-button'
            style={{"gridColumn":"1/3", "marginTop": "5px"}}>
              Submit
          </button>
        </form>
      </div>
    </>
  );
};
