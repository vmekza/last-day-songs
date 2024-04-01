import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

const Customize = () => {
  // Retrieve the playlist from localStorage on component mount
  const [playlist, setPlaylist] = useState(() => {
    const savedPlaylist = localStorage.getItem('playlist');
    return savedPlaylist ? JSON.parse(savedPlaylist) : [];
  });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [note, setNote] = useState('My day. My rules. My songs');
  const [fontSize, setFontSize] = useState('16px');
  const captureRef = useRef(null);

  // Function to generate the playlist image
  const generatePlaylistImage = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const newWindow = window.open();
        newWindow.document.write(`<img src="${image}" alt="Playlist image"/>`);
      }).catch(error => console.error('Error generating image:', error));
    }
  };

  return (
    <div>
      <div id="customization-controls">
        <label>
          Background Color:
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </label>
        <label>
          Font Size:
          <input
            type="number"
            value={fontSize.replace('px', '')}
            onChange={(e) => setFontSize(`${e.target.value}px`)}
          />
        </label>
        <label>
          Note:
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button onClick={generatePlaylistImage}>Generate Image</button>
      </div>
  
      <div
        ref={captureRef}
        style={{
          backgroundColor,
          fontSize: fontSize,
          color: 'white',
          padding: '20px',
        }}
      >
        <h2>Customize Your Playlist</h2>
        {playlist.length > 0 ? (
          playlist.map((track, index) => (
            <div key={index} style={{ margin: '10px 0' }}>
              {track.name} - {track.artists.map(artist => artist.name).join(', ')}
            </div>
          ))
        ) : (
          <div>Playlist is empty</div>
        )}
        <div style={{ marginTop: '20px' }}>{note}</div>
      </div>
    </div>
  );
};

export default Customize;
