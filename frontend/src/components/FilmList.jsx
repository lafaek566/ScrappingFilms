import React, { useEffect, useState } from "react";

function FilmList() {
  const videoUrl =
    "https://cloud.hownetwork.xyz/video.php?id=JBc8IDEYHi9vPhFhOl8jLCpVe353TFo2JzMTIBxoCW51TXEodk9C";

  return (
    <div>
      <h2>Video via iframe</h2>
      <iframe
        src={videoUrl}
        width="800"
        height="450"
        frameBorder="0"
        allowFullScreen
        title="Video Player"
      />
    </div>
  );
}
export default FilmList;
