import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import GameCarousel from './GameCarousel/GameCarousel';
import GameDetails from './GameDetail/GameDetails';
import './GameStage.css';

const GameStage = (props) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [focusElement, setFocusElement] = useState('carousel');

  useEffect(() => {
    console.log('Game stage use effect');
    console.log(props);
  });

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
        console.log(
          '----------running keydown event listener-----------------'
        );
        if (focusElement !== 'details') {
          e.preventDefault();
        }
      }
    }

    console.log('adding listener to window');
    window.addEventListener('keydown', preventDefault, false);

    return () => {
      window.removeEventListener('keydown', preventDefault);
    };
    // window.addEventListener('focus', function () {
    //   console.log('window focused');
    //   console.log(slider);
    //   slider.focus();
    // });
  }, [focusElement]);

  var refocus = (event) => {};

  var handleArrows = (event) => {
    // left arrow
    //console.log(event);
    if (event.keyCode === 40) {
      console.log(`stage down arrow - ${focusElement}`);
      setFocusElement('details');
    } else if (event.keyCode === 38) {
      console.log(`stage up arrow - ${focusElement}`);
      setFocusElement('carousel');
    }
  };

  return (
    <div onKeyDown={handleArrows}>
      <Row className="carousel-row">
        <Col>
          {props.state.datafetched && (
            <div className="carousel-container">
              <GameCarousel
                shouldFocus={focusElement === 'carousel'}
                games={props.state.games}
                setSelectedGame={setSelectedGame}
              ></GameCarousel>
            </div>
          )}
        </Col>
      </Row>
      <Row className="game-details-container">
        <Col className="game-details-column">
          {selectedGame && (
            <GameDetails
              shouldFocus={focusElement === 'details'}
              game={selectedGame}
            ></GameDetails>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default GameStage;
