import React from 'react';
import { useLocation } from 'react-router-dom';

const Customize = () => {
  const location = useLocation();
  const { playlist } = location.state;

  return (
    <div>
      {playlist.length > 0 ? (
        playlist.map((track, index) => (
          <div key={index}>
            {track.name} - {track.artists[0].name}
          </div>
        ))
      ) : (
        <div>Playlist is empty</div>
      )}
    </div>
  );
};

export default Customize;
