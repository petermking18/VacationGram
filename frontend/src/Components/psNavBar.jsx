import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './psNavBar.css';
import logo from './mainPageLogo.png';

class PSNavBar extends React.Component{
	constructor(props)
	{
		super(props);
		this.state = {
			id: '',
			back: false,
		};
	}

	goToProfile = e => {
        this.setState({back: true});
	}
	

	render(){
		return <>
		<div>
			<nav>
				<ul>
					<li className = "Title">
						<Link to={'/home/'} id="title">
							<img src={logo} alt="Avatar" className="avatarNav"></img>
							TravelGram
						</Link>
					</li>
					<li>
						<a href="" onClick = {this.goToProfile}>Back</a>
						{this.state.profile  &&<Redirect to={'/profile/'}></Redirect>}
					</li>
				</ul>
			</nav>
		</div>
		</>
	}
}

export default PSNavBar;