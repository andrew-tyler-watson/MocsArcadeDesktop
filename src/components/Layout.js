import React, { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Container, Col, Row } from 'react-bootstrap';
import GameStage from './GameStage/GameStage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';
import fetch from 'node-fetch';

const Layout = (props) => {
  // const games = props.gameService.getGames();
  // console.log(games);\

  const [state, setState] = useState({ games: null, datafetched: false });

  useAsyncEffect(async (isMounted) => {
    const data = await fetch('http://localhost:8081/api/games', {
      mode: 'cors',
    }).then((res) => res.json());
    if (!isMounted()) return;
    console.log(data);
    setState({ games: data, datafetched: true });
  }, []);

  return (
    <Container className="app-container" fluid>
      <Row className="app-header">
        <Col className="center-text">
          <h3>Welcome to the</h3>
          <h1>Mocs Arcade</h1>
        </Col>
      </Row>
      <Row className="stage-row">
        <Col>{state.datafetched && <GameStage state={state}></GameStage>}</Col>
      </Row>
    </Container>
  );
};

export default Layout;
