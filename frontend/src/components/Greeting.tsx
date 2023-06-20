import { useEffect, useState } from 'react';
import axios from 'axios';

const Greeting = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        axios.get('/api/greeting')
            .then(response => setGreeting(response.data.greeting))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>GreetingsMF</h1>
            <p>{greeting}</p>
        </div>
    );
};

export default Greeting;
