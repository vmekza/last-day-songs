import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const Search = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
  <div className="songs">
    <div className="songs_search search">
      <div className="search_item">
        <input className="search_field" type="input" placeholder="Enter name of artist or song..." onKeyDown ={event =>{
          if(event.key == "Enter") {
            console.log("Press enter")
          }
        }}
        onChange={event => setSearchInput(event.target.value)}
        />
        <button onClick={() => {console.log("Button clicked")}} className="search_button button">Search</button>
      </div>
      <div className="search_result result">
        <div className="result_card">
          <div className="result_img"><img src="#"></img></div>
          <div className="result_name">Album name</div>
          <div className="result_title">Song name </div>
          <div className='result_add'> <FontAwesomeIcon icon={faPlus} /></div>          
        </div>
   
   
      
        
        
        
       
   

      </div>
    </div>
    <div className="songs_list list">
      <p className="list_text">
        Your playlist is yet empty...<br />Search and add something!
      </p>
    </div>
  </div>
  )

};

export default Search;
