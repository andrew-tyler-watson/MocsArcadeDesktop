import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import GameCarousel from './GameCarousel/GameCarousel';
import GameDetails from './GameDetail/GameDetails';
import './GameStage.css';

const GameStage = (props) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [focusElement, setFocusElement] = useState('carousel');

  // change the focused element
  useEffect(() => {
    if (focusElement === 'details') {
      return;
    }

    function preventDefault(e) {
      if (
        ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(
          e.code
        ) > -1
      ) {
        if (focusElement !== 'details') {
          e.preventDefault();
        }
      }
    }

    window.addEventListener('keydown', preventDefault, false);

    return () => {
      window.removeEventListener('keydown', preventDefault);
    };
  }, [focusElement]);
  // handle the arrows
  var handleArrows = (event) => {
    // left arrow
    //console.log(event);
    if (event.keyCode === 40) {
      setFocusElement('details');
    } else if (event.keyCode === 38) {
      setFocusElement('carousel');
    }
  };

  return (
    <div onKeyDown={handleArrows} className="flex-container p-0">
      <Row className="carousel-row">
        <Col>
          {props.games && (
            <div className="carousel-container">
              <GameCarousel
                shouldFocus={focusElement === 'carousel'}
                {...props}
                setSelectedGame={setSelectedGame}
              ></GameCarousel>
            </div>
          )}
        </Col>
      </Row>
      <Row className="game-details-container m-0">
        <Col className="game-details-column">
          {selectedGame && (
            <GameDetails
              shouldFocus={focusElement === 'details'}
              game={selectedGame}
              {...props}
            ></GameDetails>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default GameStage;
