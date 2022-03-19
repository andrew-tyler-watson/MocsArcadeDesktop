import React, { useEffect, useState } from 'react';
import GamePreview from '../GamePreview/GamePreview';
import { propTypes } from 'react-bootstrap/esm/Image';

let selectedIndex = 0
const PreviewCarousel = (props) => {

  useEffect(() => {
    console.log("Creating interval");
    setInterval(() => {
      console.log("Changing");
      selectedIndex = (Math.abs(selectedIndex + 1) % props.previews.length);
      console.log(selectedIndex)
      const previewId = props.previews[selectedIndex].driveId
        ? props.previews[selectedIndex].driveId
        : props.previews[selectedIndex].url;
      const selectedCard = document.getElementById(previewId);
  
      selectedCard.scrollIntoView({
        block: 'nearest',
        inline: 'center',
      });
    }, 3000)
  }, []);

  let slider = null;
  let previewCards = props.previews.map((preview, i) => {
    return (
      <GamePreview isSelected={i === selectedIndex} preview={preview} key={i} />
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
      >
        {previewCards}
      </div>
    </div>
  );
};

export default PreviewCarousel;
