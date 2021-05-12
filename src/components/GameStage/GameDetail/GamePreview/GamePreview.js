import React from 'react';

export default function GamePreview(props) {
  const preview =
    props.preview.type.toLower() === 'video' ? (
      <iframe src={props.preview.url}></iframe>
    ) : (
      <img src={props.preview.url} />
    );

  return <div>{preview}</div>;
}
