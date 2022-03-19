import React, { useEffect, useState } from 'react';
import GamePreview from '../GamePreview/GamePreview';

let timer = null
const PreviewCarousel = (props) => {
  let selectedIndex = 0

  useEffect(() => {
    if (timer)
      clearInterval(timer);
    
    timer = setInterval(() => {
      selectedIndex = (Math.abs(selectedIndex + 1) % props.previews.length);
      console.log("Select ", selectedIndex, " - ", props.previews);

      const previewId = props.previews[selectedIndex].driveId
        ? props.previews[selectedIndex].driveId
        : props.previews[selectedIndex].url;
      const selectedCard = document.getElementById(previewId);

      selectedCard.scrollIntoView({
        block: 'nearest',
        inline: 'center',
      });
    }, 3000)
  });

  let slider = null;
  let previewCards = props.previews.map((preview, i) => {
    return (
      <GamePreview preview={preview} key={i} />
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
