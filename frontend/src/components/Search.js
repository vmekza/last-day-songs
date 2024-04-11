import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMusic, faPlay, faCheck, faTrashAlt, faPause, faHeadphones,faVolumeUp, faCompactDisc, faPlayCircle, faGuitar } from '@fortawesome/free-solid-svg-icons';
import audioFile from './memory.mp3';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;


const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccesstoken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [addedTracks, setAddedTracks] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(audioFile));
  const [showVisualizer, setShowVisualizer] = useState(true);



  const [showNotes, setShowNotes] = useState(false);

  const navigate = useNavigate();

  const handleCustomizeClick = () => {
    navigate('/customize', { state: { playlist } });
  };

  useEffect(() => {
    const savedPlaylist = localStorage.getItem('playlist');
  if (savedPlaylist) {
    setPlaylist(JSON.parse(savedPlaylist));
    // Rebuild the addedTracks state based on loaded playlist
    const loadedAddedTracks = JSON.parse(savedPlaylist).reduce((acc, track) => {
      acc[track.id] = true;
      return acc;
    }, {});
    setAddedTracks(loadedAddedTracks);
  }

    //API Access Token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET

    }

    fetch("https://accounts.spotify.com/api/token", authParameters )
    .then(result => result.json())
    .then(data => setAccesstoken(data.access_token))

  }, [])

  async function search() {
    setShowVisualizer(false);

    var searchURL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track,artist&limit=50`;

    try {
        const response = await fetch(searchURL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
        });
        const data = await response.json();

        if (data.tracks.items.length > 0) {
            // Update state with track results
            setSearchResults(data.tracks.items);
        } else if (data.artists.items.length > 0) {
            // If no tracks but artists are found, fetch top tracks for the first artist
            const artistId = data.artists.items[0].id;
            fetchArtistTracks(artistId);
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}

async function fetchArtistTracks(artistId) {
    var artistTracksURL = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;

    try {
        const response = await fetch(artistTracksURL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
        });
        const data = await response.json();

        setSearchResults(data.tracks);
    } catch (error) {
        console.error("Error: ", error);
    }
}

const playTrack = (previewUrl) => {
  console.log("Attempting to play URL: ", previewUrl); // Debugging line
  if(previewUrl) {
    setCurrentPreviewUrl(previewUrl);
  } else {
    console.log("No preview URL available for this track.");
  }
};

const addToPlaylist = (track) => {
  if (!addedTracks[track.id]) {
    const newPlaylist = [...playlist, track];
    setPlaylist(newPlaylist);
    setAddedTracks({...addedTracks, [track.id]: true});
    localStorage.setItem('playlist', JSON.stringify(newPlaylist)); // Save to localStorage
  }
};

const removeFromPlaylist = (trackId) => {
  const updatedPlaylist = playlist.filter(track => track.id !== trackId);
  setPlaylist(updatedPlaylist);
  const updatedAddedTracks = { ...addedTracks };
  delete updatedAddedTracks[trackId];
  setAddedTracks(updatedAddedTracks);
  localStorage.setItem('playlist', JSON.stringify(updatedPlaylist)); // Update localStorage
};

const togglePlay = () => {
  const player = audioRef.current;

  // If the music is about to play, show notes.
  if (!isPlaying) {
    setShowNotes(true);
    setTimeout(() => setShowNotes(false), 5000); // Hide notes after 3 seconds, adjust timing as needed
  }

  setIsPlaying(!isPlaying);

  if (player) {
    if (!isPlaying) {
      const playPromise = player.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback failed.', error);
          setIsPlaying(false);
        });
      }
    } else {
      player.pause();
      // If the music is stopping, don't show notes or hide them if they are already shown.
      setShowNotes(false);
    }
  }
};


  // Render musical notes conditionally
  const renderNotes = () => {
    if (!showNotes) return null;

    return (
      <div>
        <FontAwesomeIcon icon={faVolumeUp} className="music-note" style={{ right: '450px', top: '-70px', color: "#b91372" }} />
        <FontAwesomeIcon icon={faMusic} className="music-note" style={{ right: '400px', top: '-30px'}} />
        <FontAwesomeIcon icon={faHeadphones} className="music-note" style={{ right: '350px', top: '-80px', color: "#ff4365" }} />
        <FontAwesomeIcon icon={faMusic} className="music-note" style={{ right: '300px', top: '-50px', color: "#24e1cb"}} />
        <FontAwesomeIcon icon={faPlayCircle} className="music-note" style={{ right: '250px', top: '-90px' }} />
        <FontAwesomeIcon icon={faHeadphones} className="music-note" style={{ right: '200px', top: '-30px', color: "#b91372" }} />
        <FontAwesomeIcon icon={faCompactDisc} className="music-note" style={{ right: '150px', top: '-70px' }} />
        <FontAwesomeIcon icon={faMusic} className="music-note" style={{ right: '80px', top: '-80px', color: "#ff4365" }} />
        <FontAwesomeIcon icon={faGuitar} className="music-note" style={{ right: '60px', top: '-30px', color: "#24e1cb" }} />
        <FontAwesomeIcon icon={faMusic} className="music-note" style={{ right: '-10px', top: '-90px' }} />
        <FontAwesomeIcon icon={faVolumeUp} className="music-note" style={{ right: '-60px', top: '-30px', color: "#b91372" }} />
        <FontAwesomeIcon icon={faHeadphones} className="music-note" style={{ right: '-120px', top: '-90px' }} />
        <FontAwesomeIcon icon={faMusic} className="music-note" style={{ right: '-160px', top: '-30px', color: "#24e1cb"}} />
        <FontAwesomeIcon icon={faCompactDisc} className="music-note" style={{ right: '-210px', top: '-70px' }} />
      </div>

    );
};



return (
  <div className="songs">
    <div className="songs_search search">
      <div className="search_wrapper">
        <div className="search_item">
          <input className="search_field" type="input" placeholder="Enter name of artist or song..." onKeyDown ={event =>{
              if(event.key === "Enter") {
                search();
              }
          }} onChange={event => setSearchInput(event.target.value)}
          />
          <button onClick={search} className="search_button button">Search</button>

        </div>
        <div className="search_playlist playlist"
          onMouseEnter={() => setShowPlaylistDropdown(true)}
          onMouseLeave={() => setShowPlaylistDropdown(false)}
          ><FontAwesomeIcon icon={faMusic} />
          {playlist.length > 0 && (
        <div className="playlist_count">{playlist.length}</div>
    )}
          {showPlaylistDropdown && (
          <div className="playlist_dropdown">
            {playlist.length > 0 ? (
              playlist.map((track, index) => (
                <div key={index} className="playlist_track">
                  <img className="playlist_img"
                    src={track.album.images[2]?.url}
                    alt={track.name}
                  />
                  <div className='playlist_wrapper'>
                    <div className='playlist_track_artist'>{track.name} - {track.artists[0].name}</div>
                    <div className='playlist_delete_icon'><FontAwesomeIcon icon={faTrashAlt} onClick={() => removeFromPlaylist(track.id)} /></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="playlist_empty">Playlist is empty</div>
            )}
            {playlist.length > 0 && (
  <button onClick={handleCustomizeClick} className='playlist_button-customize button'>Customize</button>
)}
          </div>
        )}
        </div>
      </div>
      </div>
      <div className="search_results result">

      <div className="search_visualizer" style={{ display: showVisualizer ? 'block' : 'none' }}>

        <div className="search_play play" onClick={togglePlay}>

        {renderNotes()}
        <div className={`play_btn btn ${isPlaying ? 'stop' : 'play'}`}>
            <FontAwesomeIcon icon={isPlaying ? faPause  : faPlay } className="play_btn"/>
        </div>
      </div>
      </div>
  {searchResults.map((track) => (
    <div className="result_card" key={track.id}>
      <div className="result_img">
        <img src={track.album.images[0]?.url || '#'} alt={track.name} />
      </div>
      <div className="result_name">{track.artists[0].name}</div>
      <div className="result_title">{track.name}</div>
      <div className="result_add" onClick={() => addToPlaylist(track)}>
      {addedTracks[track.id] ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
        <FontAwesomeIcon icon={faPlus} />
            )}</div>
      <div className="result_play_icon" style={{ opacity: track.preview_url ? 1 : 0.2 }} onClick={() => track.preview_url && playTrack(track.preview_url)}>
  <FontAwesomeIcon icon={faPlay} />
</div>

    </div>
  ))}
</div>
{currentPreviewUrl && (
  <div className="global_audio_player">
    <audio controls autoPlay src={currentPreviewUrl}>
      Your browser does not support the audio element
    </audio>
  </div>
)}




  </div>
//   </div>
// )
)
};

export default Search;