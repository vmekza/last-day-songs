import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const Customize = () => {
  const [playlist, setPlaylist] = useState(() => {
    const savedPlaylist = localStorage.getItem('playlist');
    return savedPlaylist ? JSON.parse(savedPlaylist) : [];
  });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fontColor, setFontColor] = useState('#040303');
  const [note, setNote] = useState('My day. My rules. My songs');
  const [fontSize, setFontSize] = useState('16px');
  const captureRef = useRef(null);

  const generatePlaylistImage = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'playlist.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(error => console.error('Error generating image:', error));
    }
  };

  const printPlaylist = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<img src="${image}" onload="window.print();window.close()" />`);
      }).catch(error => console.error('Error generating image:', error));
    }
  };

  const emailPlaylist = () => {
    const emailBody = `
      Note: ${note}
      Background Color: ${backgroundColor}
      Font Color: ${fontColor}
      Font Size: ${fontSize}
      Playlist: ${playlist.map((track, index) => `${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`).join('\n')}
    `;
    window.location.href = `mailto:?subject=My Customized Playlist&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <div className='customize'>
      <div id='customize_controls'>
        <label className='customize_controls-label'>
          Note:
          <input className='customize_input customize_input-note'
            type='text'
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label className='customize_controls-label'>
          Background Color:
          <input className='customize_input'
            type='color'
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </label>
        <label className='customize_controls-label'>
          Font Color:
          <input className='customize_input'
            type='color'
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </label>
        <label className='customize_controls-label'>
          Font Size:
          <input className='customize_input customize_input-font'
            type='number'
            value={fontSize.replace('px', '')}
            onChange={(e) => setFontSize(`${e.target.value}px`)}
          />
        </label>

        <button className="button customize_btn" onClick={generatePlaylistImage}>Download Image</button>
        <button className="button customize_btn" onClick={printPlaylist}>Print Playlist</button>
        <button className="button customize_btn" onClick={emailPlaylist}>Email Playlist</button>
      </div>

      <div
        className='customize_list'
        ref={captureRef}
        style={{
          backgroundColor,
          color: fontColor,
          fontSize: fontSize,
        }}
      >
        <div className='customize_list-note note'>{note}</div>
        {playlist.length > 0 ? (
          playlist.map((track, index) => (
            <div key={index} style={{ margin: '15px 0px' }}>
              {index + 1}.{' '}
              <span className='note_track'>{track.name}</span> -{' '}
              {track.artists.map((artist) => artist.name).join(', ')}
            </div>
          ))
        ) : (
          <div>Playlist is empty</div>
        )}
      </div>
    </div>
  );
};

export default Customize;
