import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const CLIENT_ID = "6c69e88cb3d6418b985f5dd5c7801b3f";
const CLIENT_SECRET = "b65692da541a4177bf13bd2f43157c23";
const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccesstoken] = useState("");
  const [searchResults, setSearchResults] = useState([]);


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

  return (
  <div className="songs">
    <div className="songs_search search">
      <div className="search_item">
        <input className="search_field" type="input" placeholder="Enter name of artist or song..." onKeyDown ={event =>{
            if(event.key == "Enter") {
              search();
            }
          }} onChange={event => setSearchInput(event.target.value)}
        />
        <button onClick={search} className="search_button button">Search</button>
      </div>
      <div className="search_results result"> {searchResults.map((track) => (
          <div className="result_card" key={track.id}>
            <div className="result_img"><img src={track.album.images[0]?.url || '#'} alt={track.name} /></div>
            <div className="result_name">{track.artists[0].name}</div>
            <div className="result_title">{track.name}</div>
            <div className='result_add'><FontAwesomeIcon icon={faPlus} /></div>
          </div>
        ))}
      </div>
    </div>
    {/* <div className="songs_list list">
      <p className="list_text">
        Your playlist is yet empty...<br />Search and add something!
      </p>
    </div> */}
  </div>
  )

};

export default Search;
