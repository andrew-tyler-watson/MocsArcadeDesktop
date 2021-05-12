import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import styles from './GameDetails.css';

const GameDetails = (props) => {
  console.log(props.game.gameInfo.imageUrl);
  console.log(props.game.gameInfo.videoUrl);

  var description = null;
  var gamepreview = null;
  var authorInfo = null;

  var focusables = [];

  useEffect(() => {
    if (props.shouldFocus) {
      focusables[0].focus();
    }
  });

  var handleArrowsDetails = (event) => {
    // console.log(`Handling arrows in carousel ${event.keyCode}`);
    // console.log(`Carousel should focus  ${props.shouldFocus}`);

    console.log(`Details scroll: ${focusables[0].scrollTop}`);

    if (props.shouldFocus) {
      if (event.keyCode === 39) {
        event.stopPropagation();
      } else if (event.keyCode === 38) {
        if (focusables[0].scrollTop !== 0) {
          event.stopPropagation();
        }
      }
    }
  };

  var handleArrowsAuthor = (event) => {
    if (props.shouldFocus) {
      if (event.keyCode === 39) {
        event.stopPropagation();
      } else if (event.keyCode === 38) {
        if (focusables[0].scrollTop !== 0) {
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
            focusables.push(div);
          }}
        >
          <div>{props.game.gameInfo.description}</div>
        </Col>
        <Col className="col-6 game-preview-container">
          <iframe src={props.game.gameInfo.videoUrl}></iframe>
        </Col>
        <Col className="col-3 author-column">
          <div>Author Info</div>
        </Col>
      </Row>
    </Row>
  );
};

export default GameDetails;
