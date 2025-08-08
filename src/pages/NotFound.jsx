import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="page page-not-found">
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>
        <Link to="/">Go back Home</Link>
      </p>
    </main>
  );
};

export default NotFound;