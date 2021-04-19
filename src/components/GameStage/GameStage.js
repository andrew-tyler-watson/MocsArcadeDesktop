import React from 'react';
import GameCarousel from './GameCarousel/GameCarousel';
import GameDetailsPanel from './GameDetail/GameDetails';

const GameStage = (props) => {
  return (
    <div>
      <GameCarousel></GameCarousel>
      <GameDetailsPanel></GameDetailsPanel>
    </div>
  );
};

export default GameStage;
