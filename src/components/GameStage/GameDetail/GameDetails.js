import React, { useEffect, useState } from 'react';
import { throttle } from 'rxjs/operators';
import { interval } from 'rxjs';
import { Container, Col, Row } from 'react-bootstrap';
import styles from './GameDetails.css';
import PreviewCarousel from './PreviewCarousel/PreviewCarousel.js';
import GamePreview from './GamePreview/GamePreview';

const GameDetails = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusElement, setFocusElement] = useState('description');

  const [progress, setProgress] = useState(0.0);
  const [downloading, setDownloading] = useState(false);

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

  const previewContent =
    props.game.gameplayPreviews.length > 0 ? (
      <PreviewCarousel
        previews={props.game.gameplayPreviews}
        shouldFocus={focusElement === 'previews' && props.shouldFocus}
      ></PreviewCarousel>
    ) : (
      <iframe src={props.game.gameInfo.videoUrl}></iframe>
    );

  const renderPlayDownloadButton = () => {
    const games = [];
    if (downloading) {
      games.push(
        <div className="progress-bar d-flex" key="progress">
          {progress}%<div className="progress-bar-fill"></div>
        </div>
      );

      return games;
    }

    if (!props.game.libraryEntry.isDownloaded) {
      games.push(
        <button onClick={downloadGame} className="game-button" key="download">
          Download Game
        </button>
      );
    } else if (props.game.libraryEntry.isDownloaded) {
      games.push(
        <button className="game-button" key="launch">
          Launch Game
        </button>
      );
      games.push(
        <button className="game-button" key="launch">
          Uninstall
        </button>
      );
    }

    return games;
  };

  const downloadGame = () => {
    setDownloading(true);

    const revision = props.game.revisionHistory.revisions.find((x) => {
      return props.game.revisionHistory.latestStableVersion == x.version;
    });

    var observer = {
      next(r) {
        if (r.response === 'progress') {
          setProgress(r.percent);
        } else if (r.response === 'complete') {
          console.log('setting to false in next');
          setDownloading(false);
        }
      },
      error(err) {
        console.log(err.toString());
        console.log('setting to false in error');
        setDownloading(false);
      },
    };

    var observable = props.services.libraryService.downloadGame(
      props.game,
      revision
    );

    observable.subscribe(observer);
  };

  return (
    <div
      className="d-flex justify-content-center"
      onKeyDown={handleArrowsVerticalScrollDiv}
    >
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
        <Row className="details-action-button-row">
          <Col className="col-12 justify-content-center">
            {renderPlayDownloadButton()}
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default GameDetails;
