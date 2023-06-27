import React from 'react';
import "../styles/Header.css"
import { Props } from '../interface';

const Header: React.FC<Props> = ({children}) => {
  return (
    <div className="header"> 
      <div className='text-header'>
        {children}
      </div>
    </div>
  );
};

export default Header;
