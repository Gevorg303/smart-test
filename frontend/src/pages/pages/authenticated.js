import React, { useEffect, useState } from 'react';

const AuthenticatedPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem('jwtToken');

    if (!token) {
      alert('No token found, redirecting to login page');
      window.location.href = 'index.html'; // Переход на страницу входа
    } else {
      console.log('Token found:', token);


      fetch('localhost:8000/api/protected-endpoint', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to authenticate');
        }
      })
      .then(data => {
        setMessage('Protected data: ' + JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Authentication failed, redirecting to login page');
        window.location.href = 'index.html'; // Переход на страницу входа
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, []);

  if (loading) {
    return <h1>Loading...</h1>; // Показать индикатор загрузки
  }

  return (
    <div>
      <h1>Authenticated Page</h1>
      <p id="message">{message}</p>
    </div>
  );
};

export default AuthenticatedPage;