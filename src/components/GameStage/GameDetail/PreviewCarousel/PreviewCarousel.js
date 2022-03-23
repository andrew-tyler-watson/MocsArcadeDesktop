import React, { useEffect, useState } from 'react';
import GamePreview from '../GamePreview/GamePreview';

let timer = null
const PreviewCarousel = (props) => {
  let slider = null;
  let carouselElements = [];
  let selectedIndex = 0

  useEffect(() => {
    if (timer)
      clearInterval(timer);
    
    timer = setInterval(() => {
      selectedIndex = (Math.abs(selectedIndex + 1) % props.previews.length);
      const previewId = props.previews[selectedIndex].driveId
        ? props.previews[selectedIndex].driveId
        : props.previews[selectedIndex].url;

      $(slider).animate({scrollLeft: carouselElements[selectedIndex].offsetLeft - $( window ).width()/2 + carouselElements[selectedIndex].scrollWidth}, "slow");
    }, 3000)
  });

  let previewCards = props.previews.map((preview, i) => {
    return (
      <GamePreview preview={preview} key={i} refCallback={(div) => carouselElements.push(div)} />
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
