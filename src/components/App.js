import React from 'react';
import { Carousel, Container, Col, Row } from 'react-bootstrap';
import { getData } from '../gameService';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Layout.js';

const App = () => {
  return (
    <div className="app">
      <Layout></Layout>
    </div>
  );
};

export default App;
