import React from "react";

export default function Tile({ title, image, text }) {
  return (
    <div className="tile">
      <div className="tile-image-wrapper">
        <img src={image} alt={title} className="tile-img" />
      </div>
      <h3 className="tile-title">{title}</h3>
      <p className="tile-text">{text}</p>
    </div>
  );
}
