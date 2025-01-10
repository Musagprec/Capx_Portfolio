import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=ctvmu99r01qh15ovq8g0ctvmu99r01qh15ovq8gg')

            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>My Component</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MyComponent;
