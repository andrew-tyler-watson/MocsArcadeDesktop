import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import styles from './GameDetails.css';
import PreviewCarousel from './PreviewCarousel/PreviewCarousel.js';
import GamePreview from './GamePreview/GamePreview';

const GameDetails = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusElement, setFocusElement] = useState('description');

  var focusables = [];
  const focusStrings = ['description', 'previews', 'authorInfo'];

  useEffect(() => {
    if (props.shouldFocus) {
      focusables[selectedIndex].focus();
    }
  });

  useEffect(() => {
    setFocusElement(focusStrings[selectedIndex]);
  }, [selectedIndex]);

  var handleArrowsVerticalScrollDiv = (event) => {
    if (props.shouldFocus) {
      if (event.keyCode !== 38) {
        event.stopPropagation();
      } else {
        if (focusables[selectedIndex].scrollTop !== 0) {
          event.stopPropagation();
        } else {
          setSelectedIndex(0);
        }
      }

      if (event.keyCode === 39) {
        setSelectedIndex((selectedIndex + 1) % 3);
      } else if (event.keyCode === 37 && selectedIndex > 0) {
        const newIndex = (selectedIndex - 1) % 3;
        setSelectedIndex(newIndex);
      }
    }
  };

  // <PreviewCarousel
  //   previews={props.game.gameInfo.previews}
  //   shouldFocus={false}
  // ></PreviewCarousel>

  const previewContent = props.game.gameInfo.previews ? (
    <PreviewCarousel
      previews={props.game.gameInfo.previews}
      shouldFocus={focusElement === 'previews' && props.shouldFocus}
    ></PreviewCarousel>
  ) : (
    <iframe src={props.game.gameInfo.videoUrl}></iframe>
  );

  return (
    <div onKeyDown={handleArrowsVerticalScrollDiv}>
      <Row className="details-row">
        <Row className="details-title-row">
          <Col>
            <h1>{props.game.gameInfo.name}</h1>
          </Col>
        </Row>
        <Row className="details-detail-row">
          <Col
            className="col-3 description-column"
            tabIndex="-1"
            ref={(div) => {
              focusables.push(div);
            }}
          >
            <div>{props.game.gameInfo.description}</div>
          </Col>
          <Col
            className="col-6 game-preview-container"
            ref={(div) => {
              focusables.push(div);
            }}
          >
            {previewContent}
          </Col>
          <Col
            className="col-3 author-column"
            tabIndex="-1"
            ref={(div) => {
              focusables.push(div);
            }}
          >
            <div>Author Info</div>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default GameDetails;
