import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import vision from './monitor.png'


const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 20 }} style={{ height: 150, width: 150 }} >
			 	<div className="Tilt-inner"> <img style={{paddingTop: '12%'}} src={vision} alt='logo' /> </div>
			</Tilt>
		</div>
	)
}

export default Logo;