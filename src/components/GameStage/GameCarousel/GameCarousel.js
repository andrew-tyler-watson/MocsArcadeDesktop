import React, { useEffect, useState, createRef } from 'react';
import './GameCarousel.css';
import GameCard from '../GameCard/GameCard';
import { LibraryEntry } from '../../../models/libraryEntry';

const GameCarousel = (props) => {
  let slider = null;
  let carouselElements = [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    props.setSelectedGame(props.games[selectedIndex]);

    $(slider).animate({scrollLeft: carouselElements[selectedIndex].offsetLeft - $( window ).width() + carouselElements[selectedIndex].scrollWidth}, "fast");
  }, [selectedIndex]);

  useEffect(() => {
    if (props.shouldFocus) {
      slider.focus();
    }
  });

  let handleArrows = (event) => {
    // left arrow
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
    return <GameCard isSelected={i === selectedIndex} game={game} refCallback={(div) => carouselElements.push(div)} key={i} />;
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
