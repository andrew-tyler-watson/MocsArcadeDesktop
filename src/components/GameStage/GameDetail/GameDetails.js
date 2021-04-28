import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import styles from './GameDetails.css';

const GameDetails = (props) => {
  console.log(props.game.gameInfo.imageUrl);
  console.log(props.game.gameInfo.videoUrl);

  var description = null;
  var gamepreview = null;
  var authorInfo = null;

  var focusables = [description, gamepreview, authorInfo];

  useEffect(() => {
    if (props.shouldFocus) {
      description.focus();
    }
  });

  var handleArrowsDetails = (event) => {
    // console.log(`Handling arrows in carousel ${event.keyCode}`);
    // console.log(`Carousel should focus  ${props.shouldFocus}`);

    console.log(`Details scroll: ${description.scrollTop}`);

    if (props.shouldFocus) {
      console.log('details focus');
      description.focus();
      console.log(description);
    }

    if (props.shouldFocus) {
      if (event.keyCode === 37) {
        var newIndex =
          selectedIndex - 1 == -1 ? props.games.length - 1 : selectedIndex - 1;
        setSelectedIndex(newIndex);
      }
      //right arrow
      else if (event.keyCode === 39) {
        // go right
      } else if (event.keyCode === 38) {
        if (description.scrollTop !== 0) {
          event.stopPropagation();
        }
      }
    }
  };

  return (
    <Row className="details-row">
      <Row className="details-title-row">
        <Col>
          <h1>{props.game.gameInfo.name}</h1>
        </Col>
      </Row>
      <Row className="details-detail-row">
        <Col
          className="col-3 description-column"
          onKeyDown={handleArrowsDetails}
          tabIndex="-1"
          ref={(div) => {
            description = div;
          }}
        >
          <div>{props.game.gameInfo.description}</div>
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
