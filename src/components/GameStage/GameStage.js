import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import GameCarousel from './GameCarousel/GameCarousel';
import GameDetails from './GameDetail/GameDetails';

const GameStage = (props) => {
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    console.log('Game stage use effect');
    console.log(props);
  });

  return (
    <div>
      <Row className="carousel-row">
        <Col>
          {props.state.datafetched && (
            <div className="carousel-container">
              <GameCarousel
                games={props.state.games}
                setSelectedGame={setSelectedGame}
              ></GameCarousel>
            </div>
          )}
        </Col>
      </Row>
      <Row className="game-details-container">
        <Col className="game-details-column">
          {selectedGame && <GameDetails game={selectedGame}></GameDetails>}
        </Col>
      </Row>
    </div>
  );
};

export default GameStage;
