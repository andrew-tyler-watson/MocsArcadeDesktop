import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { useObservable } from '../utilities/customHooks.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import GameService from '../services/game-service';
import LibraryService from '../services/library-service';
import GameStage from './GameStage/GameStage';
import './Layout.css';

const libraryService = new LibraryService();
const gameService = new GameService();
const games$ = gameService.getGames();

const Layout = (props) => {
  // const games = props.gameService.getGames();
  // console.log(games);

  // const [state, setState] = useState({ games: null, datafetched: false });

  var library = [];

  games$.subscribe((games) => {
    library = libraryService.buildGameDirectoryLists(
      games.find((x) => {
        return x.gameInfo.name === 'Cubix';
      }),
      'C:Users\\andre\\source\\repos\\MocsArcadeDesktop\\Library'
    );
    console.log(JSON.stringify(library));
  });

  const games = useObservable(games$);

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
          <GameStage games={games}></GameStage>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
