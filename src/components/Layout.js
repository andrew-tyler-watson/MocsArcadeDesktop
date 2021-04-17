import React, { useState, useEffect } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Container, Col, Row } from 'react-bootstrap';
import GameCarousel from './GameStage/GameCarousel/GameCarousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import fetch from 'node-fetch';

const Layout = (props) => {
  // const games = props.gameService.getGames();
  // console.log(games);\

  const [state, setState] = useState({ games: null, datafetched: false });

  useAsyncEffect(async (isMounted) => {
    const data = await fetch('http://localhost:8081/api/games', {
      mode: 'cors',
    }).then((res) => res.json());
    if (!isMounted()) return;
    console.log(data);
    setState({ games: data, datafetched: true });
  }, []);

  // function useAsync(asyncFn, onSuccess) {
  //   useEffect(() => {
  //     let isMounted = true;
  //     await asyncFn();
  //     return () => {
  //       isMounted = false;
  //     };
  //   }, []);
  // }
  // async function setGamesAsync() {
  //   fetch('http://localhost:8081/api/games', {
  //     mode: 'cors',
  //   })
  //     .then((resp) => {
  //       console.log(resp);
  //       resp.json();
  //     })
  //     .then((data) => {
  //       if (isMounted) {
  //         onSuccess(data);
  //       }
  //     });
  // }
  //useAsync(setGamesAsync, setGames);

  return (
    <Container className="app-container" fluid>
      <Row className="app-header">
        <Col className="center-text">
          <h3>Welcome to the</h3>
          <h1>Mocs Arcade</h1>
        </Col>
      </Row>
      <Row className="carousel-container">
        <Col>
          {state.datafetched && (
            <GameCarousel games={state.games}></GameCarousel>
          )}
        </Col>
      </Row>
      <Row className="selected-game-container">
        <Col>
          <div>
            <label>Title: </label>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
