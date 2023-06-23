import React from 'react';
import "../styles/Header.css"

interface Props {
  children: React.ReactNode;
}

const Header: React.FC<Props> = ({children}) => {
  return (
    <div className="map-header"> 
      {children}
    </div>
  );
};

export default Header;
