import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './GameCard.css';

export default function GameCard(props) {
  var loadImageFromUrl = false;
  if (props.game.gameInfo.imageUrl) {
    loadImageFromUrl = true;
  }

  const classes = props.isSelected
    ? 'game-card-image game-card-selected'
    : 'game-card-image';

  return (
    <div id={props.game.gameInfo.name}>
      <img
        className={classes}
        variant="top"
        src={props.game.gameInfo.imageUrl}
      />
    </div>
  );
}
