import '../styles/hero.css'
// import Video from 'next-video';
// import heroVideo from '../../videos/hero-video.mp4'

const Hero = () => {
  return (
    <div className="container">
        {/* <div className="hero-video">
            <Video src={heroVideo}/>        
        </div> */}
        <div className="hero-title">
            <h1>Welcome to<br/>Silent Speak.</h1>
        </div>
        <div className="hero-para">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo natus architecto voluptatem dolorem soluta aut.</p>
        </div>
        <div className="hero-btn">
            <a href="#session"><button>Get Started</button></a>
        </div>
    </div>
  )
}

export default Hero;