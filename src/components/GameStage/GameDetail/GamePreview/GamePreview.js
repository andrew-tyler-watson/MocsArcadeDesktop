import React from 'react';

export default function GamePreview(props) {
  function getVideo() {
    return <iframe src={props.preview.url}></iframe>;
  }

  function getImage() {
    const imageUrl = props.preview.driveId
      ? getDriveImageUrl(props.preview.driveId)
      : props.preview.url;

    return <img style={{ width: 'auto', height: '100%' }} src={imageUrl} />;
  }

  function getDriveImageUrl(driveId) {
    return `https://drive.google.com/uc?export=view&id=${driveId}`;
  }

  var preview = '';
  if (props.preview.mediaType.toLowerCase() === 'video') {
    preview = getVideo();
  } else {
    preview = getImage();
  }

  const previewId = props.preview.driveId
    ? props.preview.driveId
    : props.preview.url;

  return <div id={previewId}>{preview}</div>;
}
