import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './NavBar.css';
import logo from './mainPageLogo.png';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            profile: false,
            logout: false,
            search: false,
            home: false,
        };
    }

    logoutUser = e => {
        this.setState({ logout: true });
    }

    goToProfile = e => {
        this.setState({ profile: true });
    }
    goToHome = e => {
        this.setState({ home: true });
    }

    goToSearch = e => {
        this.setState({ search: true });
    }

    render() {
        return <>
            <header class="header">
                <Link to={'/home/'} id="title" class="logo">
                    <img src={logo} alt="Avatar" className="avatarNav"></img>
					TravelGram
                </Link>
                <input class="menu-btn" type="checkbox" id="menu-btn" />
                <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
                <ul class="menu">
                    <li>
                        <a href="" onClick={this.goToHome}>Feed</a>
                        {this.state.home &&<Redirect to={'/home/'}></Redirect>}
                    </li>
                    <li>
						<a href="" onClick = {this.goToProfile}>Profile</a>
						{this.state.profile  &&<Redirect to={'/profile/:id'}></Redirect>}
					</li>
                    <li>
						<a href="" onClick={this.goToSearch}>Search</a>
						{this.state.search  && <Redirect to={'/search/:id'}/> }
					</li>
                    <li>
						<a href = "" onClick = {this.logoutUser}>Logout</a>
						{this.state.logout  && <Redirect to="/login" /> }
					</li>
                </ul>
            </header>
        </>
    }
}
