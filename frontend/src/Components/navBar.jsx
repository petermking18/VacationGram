import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from './mainPageLogo.png';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
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
    componentDidMount(){
        console.log("NavBar mounted, user id: " + this.state.id);
    }

    render() {
        return <>
            <header className="header">
                <Link to={{
                    pathname: '/home/',
                    curr_user_id: this.state.id
                }} id="title" className="logo">
                    <img src={logo} alt="Avatar" className="avatarNav"></img>
                    TravelGram
                </Link>
                <input className="menu-btn" type="checkbox" id="menu-btn" />
                <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>
                <ul className="menu">
                    <li>
                        <Link to={{
                            pathname: '/home/',
                            curr_user_id: this.state.id
                        }}>Feed</Link>
                    </li>
                    <li>
                        <Link to={{
                            pathname: '/profile/',
                            curr_user_id: this.state.id
                        }}>Profile</Link>
                    </li>
                    <li>
                        <Link to={{
                            pathname: '/search/',
                            curr_user_id: this.state.id
                        }}>Search</Link>
                    </li>
                    <li>
                        <Link to={{
                            pathname: '/',
                            curr_user_id: this.state.id
                        }}>Logout</Link>
                    </li>
                </ul>
            </header>
            <div id="spacer"/>
        </>
    }
}
