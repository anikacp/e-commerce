import './Landing.css';
// import land from '../../asset/brand/men2.png';
// import { Link } from "react-router-dom";
// import { Button } from "@mui/material";

const Landing = () => {
    return ( 
        <div className='landing__container'>
            <iframe 
                className='landing__iframe'
                src="https://www.spatial.io/embed/favorite_gnat199s-Hi-Fi-Place-660a81c9b078cda070b5a410?share=7400456488705104419&autoplay=1" 
                width="2000px" 
                height="500px" 
                allow="camera; fullscreen; autoplay; display-capture; microphone; clipboard-write"
            ></iframe>
        </div>
     );
}
 
export default Landing;
