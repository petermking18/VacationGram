import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './navBar.css';
import logo from './mainPageLogo.png';

class NavBar extends React.Component{
	constructor(props)
	{
		super(props);
		this.state = {
			id: '',
			profile: false,
			logout: false,
			search: false,
			home: false,
			newPost: false
		};
	}

	logoutUser = e => {
        this.setState({logout: true});
	}

	goToProfile = e => {
        this.setState({profile: true});
	}
	goToHome = e => {
        this.setState({home: true});
	}

	goToSearch = e => {
		this.setState({search: true});
	}

	goToNewPost = e => {
		this.setState({newPost: true});
	}
	

	render(){
		return <>
		<div>
			<nav>
				<ul>
					<li className = "Title">
						<Link to={'/home/' + this.props.id} id="title">
							<img src={logo} alt="Avatar" className="avatarNav"></img>
							TravelGram
						</Link>
					</li>
					<li>
						<a href = "" onClick = {this.logoutUser}>Logout</a>
						{this.state.logout  && <Redirect to="/login" /> }
					</li>
					<li>
						<a href="" onClick={this.goToSearch}>Search</a>
						{this.state.search  && <Redirect to={'/search/' + this.props.id}/> }
					</li>
					<li>
						<a href="" onClick = {this.goToProfile}>Profile</a>
						{this.state.profile  &&<Redirect to={'/profile/' + this.props.id}></Redirect>}
					</li>
					<li>
						{/* <a onClick = {this.goToDash} href="">Feed</a>
						{this.state.dash &&<Redirect to={'/home/' + this.props.id}></Redirect>} */}
						<a onClick = {this.goToHome} href="">Feed</a>
						{this.state.home &&<Redirect to={'/home/' + this.props.id}></Redirect>}
					</li>
				</ul>
			</nav>
		</div>
		</>
	}
}

export default NavBar;