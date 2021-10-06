import React from 'react';
import { Carousel, Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Layout.js';
import ServiceHub from '../services/services.js';

const services = new ServiceHub();

const App = () => {
  return (
    <div className="app">
      <Layout services={services}></Layout>
    </div>
  );
};

export default App;
