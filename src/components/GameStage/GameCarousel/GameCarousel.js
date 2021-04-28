import React, { useEffect, useState, createRef } from 'react';
import { Carousel } from 'react-bootstrap';
import './GameCarousel.css';
import GameCard from '../GameCard/GameCard';

var image = require('../../../assets/Bigscreen_Screenshot.png');

const GameCarousel = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log(selectedIndex);
  console.log(props);

  console.log(`Carousel shouldFocus = ${props.shouldFocus}`);

  useEffect(() => {
    console.log(`Use Effect selected index: ${selectedIndex}`);
    console.log(props.games[selectedIndex].gameInfo.name);
    props.setSelectedGame(props.games[selectedIndex]);

    const selectedCard = document.getElementById(
      props.games[selectedIndex].gameInfo.name
    );

    selectedCard.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [selectedIndex]);

  useEffect(() => {
    if (props.shouldFocus) {
      slider.focus();
    }
  });

  let slider = null;

  let handleArrows = (event) => {
    // left arrow
    console.log(`Handling arrows in carousel ${event.keyCode}`);
    console.log(`Carousel should focus  ${props.shouldFocus}`);
    if (event.keyCode === 37 && props.shouldFocus) {
      var newIndex =
        selectedIndex - 1 == -1 ? props.games.length - 1 : selectedIndex - 1;
      setSelectedIndex(newIndex);
    }
    //right arrow
    else if (event.keyCode === 39 && props.shouldFocus) {
      setSelectedIndex(Math.abs(selectedIndex + 1) % props.games.length);
    }
  };

  let gameCards = props.games.map((game, i) => {
    // console.log(`Game Card: ${i} Selected Index: ${selectedIndex}`);
    // console.log(`i === selectedIndex ${i === selectedIndex}`);
    return <GameCard isSelected={i === selectedIndex} game={game} key={i} />;
  });

  return (
    <div className="slider">
      <div
        className="slides"
        tabIndex="0"
        ref={(div) => {
          slider = div;
        }}
        onKeyDown={handleArrows}
      >
        {gameCards}
      </div>
    </div>
  );
};

export default GameCarousel;
