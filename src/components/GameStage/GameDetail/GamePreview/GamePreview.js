import React from 'react';

export default function GamePreview(props) {
  const preview =
    props.preview.type.toLowerCase() === 'video' ? (
      <iframe src={props.preview.url}></iframe>
    ) : (
      <img style={{ width: 'auto', height: '100%' }} src={props.preview.url} />
    );

  return <div id={props.preview.url}>{preview}</div>;
}
