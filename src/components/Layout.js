import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import GameCarousel from './Game/GameCarousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Layout = () => {
  const games = [
    { name: 'Game 1' },
    { name: 'Game 2' },
    { name: 'Game 3' },
    { name: 'Game 4' },
    { name: 'Game 5' },
    { name: 'Game 6' },
    { name: 'Game 7' },
    { name: 'Game 8' },
    { name: 'Game 9' },
    { name: 'Game 10' },
    { name: 'Game 11' },
    { name: 'Game 12' },
    { name: 'Game 13' },
    { name: 'Game 14' },
    { name: 'Game 15' },
  ];

  return (
    <Container className="app-container" fluid>
      <Row className="app-header">
        <Col className="center-text">
          <h3>Welcome to the</h3>
          <h1>Mocs Arcade</h1>
        </Col>
      </Row>
      <Row className="carousel-container">
        <Col>
          <GameCarousel games={games}></GameCarousel>
        </Col>
      </Row>
      <Row className="selected-game-container">
        <Col>
          <div>
            <label>Title: </label>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
