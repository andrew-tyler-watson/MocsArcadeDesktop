import React, { useEffect, useState } from 'react';
import GamePreview from '../GamePreview/GamePreview';
import { propTypes } from 'react-bootstrap/esm/Image';

const PreviewCarousel = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (props.shouldFocus) {
      const previewId = props.previews[selectedIndex].driveId
        ? props.previews[selectedIndex].driveId
        : props.previews[selectedIndex].url;
      const selectedCard = document.getElementById(previewId);

      selectedCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (props.shouldFocus) {
      slider.focus();
    }
  });

  let slider = null;

  let handleArrows = (event) => {
    if (props.shouldFocus) {
      //left
      if (event.keyCode === 37 && selectedIndex > 0) {
        var newIndex =
          selectedIndex - 1 == -1
            ? props.previews.length - 1
            : selectedIndex - 1;
        setSelectedIndex(newIndex);
        event.stopPropagation();
      }

      //right arrow
      if (event.keyCode === 39 && selectedIndex < previewCards.length - 1) {
        setSelectedIndex(Math.abs(selectedIndex + 1) % props.previews.length);
        event.stopPropagation();
      }
    }
  };

  let previewCards = props.previews.map((preview, i) => {
    return (
      <GamePreview isSelected={i === selectedIndex} preview={preview} key={i} />
    );
  });

  return (
    <div className="slider" onKeyDown={handleArrows}>
      <div
        className="slides"
        tabIndex="0"
        ref={(div) => {
          slider = div;
        }}
      >
        {previewCards}
      </div>
    </div>
  );
};

export default PreviewCarousel;
