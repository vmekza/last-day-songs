import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMusic, faPlay, faCheck, faTrashAlt, faPause } from '@fortawesome/free-solid-svg-icons';


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const popularSongsData = [
  {
    id: '1',
    name: 'Bye Bye Baby',
    artists: [{ name: 'Bay City Rollers' }],
    album: {
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2735b646e3a50ea4f0e4c5b5aa3' }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/1e27849d9e8481b68bad224955f6cf964afd70d0?cid=6c69e88cb3d6418b985f5dd5c7801b3f'
  },
  {
    id: '2',
    name: 'David Bowie',
    artists: [{ name: 'Under Pressure' }],
    album: {
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273a47e80463147d1877608d56b' }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/e573641a3b4e3b126d37c2b4573e197dcac2f354?cid=6c69e88cb3d6418b985f5dd5c7801b3f'
  },
  {
    id: '3',
    name: 'Linkin Park',
    artists: [{ name: 'In the end' }],
    album: {
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e2f039481babe23658fc719a' }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/b5ee275ca337899f762b1c1883c11e24a04075b0?cid=6c69e88cb3d6418b985f5dd5c7801b3f'
  },
  {
    id: '4',
    name: 'Lou Reed',
    artists: [{ name: 'Perfect day' }],
    album: {
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273d55149748dca0e5a1f40778e' }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/84d43797277b787143eb09575da79623a2141efa?cid=6c69e88cb3d6418b985f5dd5c7801b3f'
  },
  {
    id: '5',
    name: 'Hans Zimmer',
    artists: [{ name: 'Day One (Interstellr)' }],
    album: {
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ac29a65e7ffcfa6f9cb0d342' }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/6633d359c78b728568527226197ed891a652efff?cid=6c69e88cb3d6418b985f5dd5c7801b3f'
  }

]

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccesstoken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [addedTracks, setAddedTracks] = useState({});

  const [popularSongs, setPopularSongs] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);


  const navigate = useNavigate();

  const handleCustomizeClick = () => {
    navigate('/customize', { state: { playlist } });
  };

  useEffect(() => {
    // Directly set popular songs from predefined data
    setPopularSongs(popularSongsData);
  }, []);

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


const playTrack = (previewUrl, trackId) => {
  // Toggle play/pause if the same track is clicked
  if (currentPlayingId === trackId && isPlaying) {
    setCurrentPreviewUrl(null);
    setIsPlaying(false);
    setCurrentPlayingId(null);
  } else {
    setCurrentPreviewUrl(previewUrl);
    setIsPlaying(true);
    setCurrentPlayingId(trackId);
  }
};


const addToPlaylist = (track) => {
  if (!addedTracks[track.id]) {
    const newPlaylist = [...playlist, track];
    const newAddedTracks = { ...addedTracks, [track.id]: true }; // Ensure the track is marked as added
    setPlaylist(newPlaylist);
    setAddedTracks(newAddedTracks);
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




return (
  <div className="songs">
    <div className="songs_search search">
      <div className="search_wrapper">
        <div className="search_item">
          <input
            className="search_field"
            type="input"
            placeholder="Enter name of artist or song..."
            onKeyDown={event => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <button onClick={search} className="search_button button">Search</button>
        </div>
        <div className="search_playlist playlist"
          onMouseEnter={() => setShowPlaylistDropdown(true)}
          onMouseLeave={() => setShowPlaylistDropdown(false)}>
          <FontAwesomeIcon icon={faMusic} />
          {playlist.length > 0 && (
            <div className="playlist_count">{playlist.length}</div>
          )}
          {showPlaylistDropdown && (
            <div className="playlist_dropdown">
              {playlist.length > 0 ? (
                playlist.map((track, index) => (
                  <div key={index} className="playlist_track">
                    <img className="playlist_img" src={track.album.images[0]?.url} alt={track.name} />
                    <div className='playlist_wrapper'>
                      <div className='playlist_track_artist'>{track.name} - {track.artists[0].name}</div>
                      <div className='playlist_delete_icon'>
                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => removeFromPlaylist(track.id)} />
                      </div>
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
    {searchResults.length === 0 && (
        <div className="result_title-popular">Most Popular Tracks</div> // This title will only show when there are no search results
      )}
      <div className="result_card-wrapper">
      {searchResults.length > 0 ? (
        searchResults.map((track) => (

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
              )}
            </div>
            <div className="result_play_icon" style={{ opacity: track.preview_url ? 1 : 0.2 }} onClick={() => track.preview_url && playTrack(track.preview_url, track.id)}>
              {isPlaying && currentPlayingId === track.id ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </div>
          </div>


        ))

      ) : (

        popularSongs.map((track) => (

          <div className="result_card" key={track.id}>
            <div className="result_img">
              <img src={track.album.images[0].url} alt={track.name} />
            </div>
            <div className="result_name">{track.artists[0].name}</div>
            <div className="result_title">{track.name}</div>
            <div className="result_add" onClick={() => addToPlaylist(track)}>
              {addedTracks[track.id] ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faPlus} />
                )}
            </div>
            <div className="result_play_icon" style={{ opacity: track.preview_url ? 1 : 0.2 }} onClick={() => track.preview_url && playTrack(track.preview_url, track.id)}>
            {isPlaying && currentPlayingId === track.id ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </div>
          </div>


        ))
      )}
    </div>
    </div>
    {currentPreviewUrl && (
      <div className="global_audio_player">
        <audio controls autoPlay src={currentPreviewUrl}>
          Your browser does not support the audio element
        </audio>
      </div>
    )}
  </div>
);

}

export default Search;