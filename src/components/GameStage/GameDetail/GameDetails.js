import React, { useEffect, useState } from 'react';
import { throttle } from 'rxjs/operators';
import { interval } from 'rxjs';
import { Container, Col, Row } from 'react-bootstrap';
import styles from './GameDetails.css';
import PreviewCarousel from './PreviewCarousel/PreviewCarousel.js';
import GamePreview from './GamePreview/GamePreview';

const GameDetails = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [progress, setProgress] = useState(0.0);
  const [downloading, setDownloading] = useState(false);

  const previewContent =
    props.game.gameplayPreviews.length > 0 ? (
      <PreviewCarousel
        previews={props.game.gameplayPreviews}
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
    <div className="d-flex justify-content-center">
      <Row className="details-row">
        <Row className="details-title-row">
          <Col>
            <h1>{props.game.gameInfo.name}</h1>
          </Col>
        </Row>
        <Row className="details-detail-row">
          <Col className="col-3 description-column">
            <div>{props.game.gameInfo.description}</div>
          </Col>
          <Col className="col-6 game-preview-container">
            {previewContent}
          </Col>
          <Col className="col-3 author-column">
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
