import React, { useEffect, useState, createRef } from 'react';
import { Carousel } from 'react-bootstrap';
import './GameCarousel.css';
import GameCard from '../GameCard/GameCard';

var image = require('../../../assets/Bigscreen_Screenshot.png');

const GameCarousel = (props) => {
  // const numGames = props.games.length;
  // const [listState, setListState] = useState({
  //   selectedIndex: 0,
  //   refs: [],
  // });

  // const setRefs = (refs) => {
  //   Array(numGames)
  //     .fill()
  //     .map((_, i) => refs[i] || createRef());
  // };

  // useEffect(() => {
  //   setListState({ refs: setRefs(refs) });
  // }, [numGames]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [shouldFocus, setShouldFocus] = useState(true);

  console.log(selectedIndex);
  console.log(props);

  console.log(`shouldFocus = ${shouldFocus}`);

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

  let slider = null;

  let handleArrows = (event) => {
    // left arrow
    //console.log(event);
    if (event.keyCode === 37 && shouldFocus) {
      var newIndex =
        selectedIndex - 1 == -1 ? props.games.length - 1 : selectedIndex - 1;
      setSelectedIndex(newIndex);
    }
    //right arrow
    else if (event.keyCode === 39 && shouldFocus) {
      setSelectedIndex(Math.abs(selectedIndex + 1) % props.games.length);
    } else if (event.keyCode === 40) {
      setShouldFocus(false);
    } else if (event.keyCode === 38) {
      setShouldFocus(true);
    }
  };

  useEffect(() => {
    if (shouldFocus) {
      window.addEventListener('focus', function () {
        console.log('window focused');
        console.log(slider);
        slider.focus();
      });
      window.addEventListener(
        'keydown',
        function (e) {
          if (
            [
              'Space',
              'ArrowUp',
              'ArrowDown',
              'ArrowLeft',
              'ArrowRight',
            ].indexOf(e.code) > -1
          ) {
            e.preventDefault();
          }
        },
        false
      );
    }
  }, [shouldFocus]);

  let gameCards = props.games.map((game, i) => {
    console.log(`Game Card: ${i} Selected Index: ${selectedIndex}`);
    console.log(`i === selectedIndex ${i === selectedIndex}`);
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
