import React from 'react'
import ReactDOM from 'react-dom/client'
import GreetingComponent from './components/Greeting'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GreetingComponent />
  </React.StrictMode>,
)
