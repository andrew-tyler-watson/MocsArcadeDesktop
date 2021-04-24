import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const GameDetails = (props) => {
  console.log(props.game.gameInfo.imageUrl);
  console.log(props.game.gameInfo.videoUrl);

  const [shouldFocus, setShouldFocus] = useState(false);

  let handleArrows = (event) => {
    // left arrow
    //console.log(event);
    if (event.keyCode === 37) {
      var newIndex =
        selectedIndex - 1 == -1 ? props.games.length - 1 : selectedIndex - 1;
      setSelectedIndex(newIndex);
    }
    //right arrow
    else if (event.keyCode === 39) {
      setSelectedIndex(Math.abs(selectedIndex + 1) % props.games.length);
    } else if (event.keyCode === 40) {
      props.handleDownArrow();
    }
  };

  useEffect(() => {
    if (shouldFocus) {
      window.addEventListener('focus', function () {
        console.log('window focused');
        console.log(slider);
        slider.focus();
      });
      window.addEventListener(
        'keydown',
        function (e) {
          if (
            [
              'Space',
              'ArrowUp',
              'ArrowDown',
              'ArrowLeft',
              'ArrowRight',
            ].indexOf(e.code) > -1
          ) {
            e.preventDefault();
          }
        },
        false
      );
    }
  }, [shouldFocus]);

  return (
    <Row className="details-row">
      <Row className="details-title-row">
        <Col>
          <h1>{props.game.gameInfo.name}</h1>
        </Col>
      </Row>
      <Row className="details-detail-row">
        <Col className="col-3 description-column">
          <p>{props.game.gameInfo.description}</p>
        </Col>
        <Col className="col-6 game-preview-container">
          <iframe src={props.game.gameInfo.videoUrl}></iframe>
        </Col>
        <Col className="col-3">
          <p>Author Info</p>
        </Col>
      </Row>
    </Row>
  );
};

export default GameDetails;
