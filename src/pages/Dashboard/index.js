import React from 'react';
import { Link } from 'react-router-dom';

// import { Container } from './styles';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/profile">Profile</Link>
    </div>
  );
}
