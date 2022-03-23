import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { useObservable } from '../utilities/customHooks.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import GameStage from './GameStage/GameStage';
import './Layout.css';
window.$ = window.jQuery = require('jquery');

const Layout = (props) => {
  // const games = props.gameService.getGames();
  // console.log(games);

  // const [state, setState] = useState({ games: null, datafetched: false });

  const games = useObservable(props.services.gameService.games$);
  console.log(games);

  return (
    <Container className="app-container" fluid>
      <Row className="app-header">
        <Col className="center-text">
          <h3>Welcome to the</h3>
          <h1>Mocs Arcade</h1>
        </Col>
      </Row>
      <Row className="stage-row">
        <Col>
          <GameStage games={games} {...props}></GameStage>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
