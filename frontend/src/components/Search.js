import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMusic, faPlay, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CLIENT_ID = "6c69e88cb3d6418b985f5dd5c7801b3f";
const CLIENT_SECRET = "b65692da541a4177bf13bd2f43157c23";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccesstoken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [addedTracks, setAddedTracks] = useState({});



  useEffect(() => {
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


const playTrack = (previewUrl) => {
  console.log("Attempting to play URL: ", previewUrl); // Debugging line
  if(previewUrl) {
    setCurrentPreviewUrl(previewUrl);
  } else {
    console.log("No preview URL available for this track.");
  }
};
const addToPlaylist = (track) => {
  if (!addedTracks[track.id]) { // Check if the track hasn't been added yet
    setPlaylist(currentPlaylist => [...currentPlaylist, track]);
    setAddedTracks({...addedTracks, [track.id]: true}); // Mark the track as added
  }
};

const removeFromPlaylist = (trackId) => {
  // Filter out the track with the specific ID from the playlist
  const updatedPlaylist = playlist.filter(track => track.id !== trackId);
  setPlaylist(updatedPlaylist);

  // Optionally, update the addedTracks state to reflect the removal
  const updatedAddedTracks = { ...addedTracks };
  delete updatedAddedTracks[trackId];
  setAddedTracks(updatedAddedTracks);
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
          </div>
        )}
        </div>
      </div>
      </div>
      <div className="search_results result">
  {searchResults.map((track) => (
    <div className="result_card" key={track.id}>
      <div className="result_img">
        <img src={track.album.images[0]?.url || '#'} alt={track.name} />
      </div>
      <div className="result_name">{track.artists[0].name}</div>
      <div className="result_title">{track.name}</div>
      <div className="result_add"onClick={() => addToPlaylist(track)}>
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
  )

};

export default Search;
