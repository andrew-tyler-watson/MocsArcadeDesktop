import React from 'react';
import GamePreview from '../GameDetail/GamePreview/GamePreview';
import { Card } from 'react-bootstrap';
import styles from './GameCard.css';

export default function GameCard(props) {
  var loadImageFromUrl = false;
  if (props.game.gameInfo.imageUrl) {
    loadImageFromUrl = true;
  }

  const classes = props.isSelected
    ? 'game-card-image game-card-selected align-center'
    : 'game-card-image';

  return (
    <GamePreview preview={props.game.gameplayPreviews[0]} refCallback = {props.refCallback} className={classes}/>
  );
}
