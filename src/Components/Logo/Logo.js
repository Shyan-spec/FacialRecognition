import React from 'react';
import Tilt from 'react-tilty'
import './Logo.css'
import Head from './Head.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
        <Tilt className="Tilt br2 shadow-2" options={{max : 55}} style={{height : 150, width: 150}}>
        <div className="Tilt-inner"> <img style={{paddingTop:'22px'}} alt='head' src={Head}></img> </div>
        </Tilt>
        </div>
    );
}

export default Logo; 