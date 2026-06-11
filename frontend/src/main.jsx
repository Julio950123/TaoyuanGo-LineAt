import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Stores from './pages/Stores';
import Offers from './pages/Offers';
import Writers from './pages/Writers';
import Settings from './pages/Settings';
import Friends from './pages/Friends';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="news" element={<News />} />
        <Route path="stores" element={<Stores />} />
        <Route path="offers" element={<Offers />} />
        <Route path="writers" element={<Writers />} />
        <Route path="friends" element={<Friends />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
