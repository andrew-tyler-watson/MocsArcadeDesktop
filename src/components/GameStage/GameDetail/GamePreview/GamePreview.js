import React from 'react';

export default function GamePreview(props) {
  
  function getVideo() {
    return <iframe src={props.preview.url}></iframe>;
  }

  function getImage() {
    const imageUrl = props.preview.driveId
      ? getDriveImageUrl(props.preview.driveId)
      : props.preview.url;

    return <img style={{ height: '100%' }} src={imageUrl} />;
  }

  function getDriveImageUrl(driveId) {
    return `https://drive.google.com/uc?export=view&id=${driveId}`;
  }

  // function getYoutubeVideoFrameUrl(driveId) {
  //   <iframe src={props.game.gameInfo.videoUrl}></iframe>
  // }

  var preview = '';
  if (props.preview.type.toLowerCase() === 'video') {
    preview = getVideo();
  } else {
    preview = getImage();
  }

  return <div ref={(div) => {props.refCallback(div)}} className={props.className}>{preview}</div>;
}
