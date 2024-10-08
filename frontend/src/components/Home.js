import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home'>
      <video className='home_bg' src='space.mp4' autoPlay muted loop />
      <div>
        <div className='left_content'>
          <p className='left_content_top top'>
            <span>
              <i>Make in advance</i>
            </span>
            <br></br>
            <span>
              <i>a playlist for your</i>
            </span>
            <br></br>
            <span>
              <i>Celebration of Life.</i>
            </span>
            <br></br>
            <br></br>
            <span>
              <i className='top_save-share'>[ Save it or share it ]</i>
            </span>
            <br></br>
            <br></br>
          </p>
          <p className='left_content_bottom'>
            <span>
              <i>Do not take risk </i>
            </span>
            <br></br>
            <span>
              <i>having bad songs </i>
            </span>
            <br></br>
            <span>
              <i>on your last ride!</i>
            </span>
          </p>
        </div>
      </div>
      <div>
        <div className='right_content'>
          <h1 className='right_content-top'>
            <span className='right_content-title'>Your</span>
            <div className='right_content_flip flip'>
              <div>
                <div className='flip_songs'>songs</div>
              </div>
              <div>
                <div className='flip_rules'>rules</div>
              </div>
              <div>
                <div className='flip_day'>day</div>
              </div>
            </div>
          </h1>
          <p>Just a little reminder everyone</p>
          <p> how superior your music taste was...</p>
          <div className='right_content-button'>
            <Link to='/search' className='button btn_start'>
              Start
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
