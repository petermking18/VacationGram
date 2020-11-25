import React from 'react';
import {TravelGramRepo} from '../Api/TravelGramRepo';
import { Redirect } from 'react-router-dom';
import NavBar from "./NavBar";
import "./profilePage.css"

///This page is settings page
export default class ProfilePage extends React.Component {
    repo = new TravelGramRepo();
    constructor(props)
    {
        super(props)
        this.state = {
            id:'',
            name: '',
            email: '',
            password: '',
            postPage: false,
            savedPage: false,
        };
    }

    goPostPage = e => {
        this.setState({postPage: true});
    }

    render() {
        return (
            <>
                <NavBar id={this.props.match.params.id}/>
                {/* <div className = "container boostrap-snippet header-container"> */}
                <div className="container">
                    <div className = "bg-white">
                        <div className = "container py-0">
                            <div className = "media col-md-10 cold-lg-8 col-xl-7 p-0 my-4 mx-auto">
                                <img alt="profilePhoto" src = "https://www.smu.edu/-/media/Images/News/Experts/Mark-Fontenot.jpg?la=en" className = "d-block ui-w-100 rounded circle" id = "profImg"/>
                            </div>
                            <div className = "profUsername">
                                    <h4 className = "font-weight-bold mb-4">Mark Fontenot</h4>
                            </div>
                        </div>
                        <hr className = "m-0"/>
                        <ul className="nav nav-tabs tabs-alt justify-content-center">
                            <li className="nav-item">
                            <a onClick={this.goPostPage} className="nav-link py-4" href="#"><img src="https://cdn.icon-icons.com/icons2/1875/PNG/512/imagegallery_120168.png" id="galleryIcon" alt="Posts"/></a>
                            {this.state.postPage && <Redirect to={"/profile/:id"}/>}
                            </li>
                            <li className="nav-item">
                            <a className="nav-link py-4" href="#"><img src = "https://www.flaticon.com/svg/static/icons/svg/84/84510.svg" id="bookMarkIcon" alt="Saved"/></a>
                            </li>
                            <li className="nav-item">
                            <a className="nav-link py-4 active" href="#"><img src = "https://icon-library.net/images/white-gear-icon-png/white-gear-icon-png-13.jpg" id = "gearIcon" alt="Settings"/></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <form className="settingsContainer">
                    <h1> Profile Settings</h1>
                    <div className="form-group">
                        <label htmlFor="name">First Name</label>
                        <input type="text"
                               id="name"
                               name="name"
                               className="form-control"
                               value={this.state.name}
                               onChange={e => this.setState({ name: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text"
                               id="email"
                               name="email"
                               className="form-control"
                               value={this.state.email}
                               onChange={e => this.setState({ email: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="text"
                               id="password"
                               name="password"
                               className="form-control"
                               value={this.state.password}
                               onChange={e => this.setState({ password: e.target.value })} />
                    </div>
                    <br></br>

                    <button id = "settingsButton" className="btn btn-primary btn-block" onClick={() => this.updateUserInfo(this.state.id, this.state.name, this.state.email, this.state.password, this.state.specialist, this.state.birthday)}>Save</button>
                </form>
            </>
        );
    }
}