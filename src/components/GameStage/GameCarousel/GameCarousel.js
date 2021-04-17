import React, { useEffect, useState, createRef } from 'react';
import { Carousel } from 'react-bootstrap';
import './GameCarousel.css';

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

  console.log(selectedIndex);
  console.log(props);

  useEffect(() => {
    console.log(selectedIndex);
    console.log(props.games[selectedIndex].gameInfo.name);
    document
      .getElementById(props.games[selectedIndex].gameInfo.name)
      .scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
  }, [selectedIndex]);

  let slider = null;

  let handleArrows = (event) => {
    // left arrow
    //console.log(event);
    if (event.keyCode === 37) {
      var newIndex =
        selectedIndex - 1 == -1 ? props.games.length - 1 : selectedIndex - 1;
      setSelectedIndex(newIndex);
    }
    //right arrow
    else if (event.keyCode === 39) {
      setSelectedIndex(Math.abs(selectedIndex + 1) % props.games.length);
    }
  };

  useEffect(() => {
    window.addEventListener('focus', function () {
      console.log('window focused');
      console.log(slider);
      slider.focus();
    });
    window.addEventListener(
      'keydown',
      function (e) {
        if (
          ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(
            e.code
          ) > -1
        ) {
          e.preventDefault();
        }
      },
      false
    );
  });

  let gameCards = props.games.map((game, i) => {
    return (
      <div key={i} id={game.gameInfo.name}>
        {game.gameInfo.name}
      </div>
    );
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
