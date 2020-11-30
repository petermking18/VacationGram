import React from 'react';
import { VacationGramAPIClient } from '../Api/VacationGramAPIClient';
import { Redirect } from 'react-router-dom';
import NavBar from "./NavBar";
import "./profilePage.css"

///This page is settings page
export default class ProfilePage extends React.Component {
    apiClient = new VacationGramAPIClient();
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            profUsername: "",
            profImgUrl: "",
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            imageUrl: '',
            postPage: false,
            savedPage: false,
        };
    }

    goPostPage = e => {
        this.setState({ postPage: true });
    }
    goSavedPage = e => {
        this.setState({ savedPage: true });
    }
    async load() {
        //get current username & profile image url
        await this.apiClient.getUserInfo(this.state.id).then(user => {
            this.setState({ profUsername: user.info[0].name });
            this.setState({ profImgUrl: user.info[0].image_url});
        });
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        console.log("Profile Settings mounted, user id: " + this.props.match.params.id);
        this.load();
    }
    updateUserInfo() {
        var updateInfo = {};
        if(this.state.name !== '') updateInfo["name"] = this.state.name;
        if(this.state.email !== '') updateInfo["email"] = this.state.email;
        if(this.state.password !== '' && this.state.password === this.state.confirmPassword) updateInfo["password"] = this.state.password;
        if(this.state.imageUrl !== '') updateInfo["image_url"] = this.state.imageUrl;

        this.apiClient.updateUser(this.state.id, updateInfo);

        if (this.state.name !== '') {
            this.setState({ profUsername: this.state.name });
        }
        if (this.state.imageUrl !== '') {
            this.setState({ profImgUrl: this.state.imageUrl });
        }
        this.setState({name: '', email: '', password: '', confirmPassword: '', imageUrl: ''});
    }
    passwordsDoNotMatch() {
        if (this.state.password !== '') {
            if (this.state.password !== this.state.confirmPassword) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <>
                <NavBar id={this.state.id} />
                <div className="container">
                    <div className="bg-white">
                        <div className="container py-0">
                            <div className="media col-md-10 cold-lg-8 col-xl-7 p-0 my-4 mx-auto">
                                <img alt="profilePhoto" src={this.state.profImgUrl} className="d-block ui-w-100 rounded circle" id="profImg" />
                            </div>
                            <div className="profUsername">
                                <h4 className="font-weight-bold mb-4">{this.state.profUsername}</h4>
                            </div>
                        </div>
                        <hr className="m-0" />
                        <ul className="nav nav-tabs tabs-alt justify-content-center">
                            <li className="nav-item">
                                <a onClick={this.goPostPage} className="nav-link py-4"><img src="https://cdn.icon-icons.com/icons2/1875/PNG/512/imagegallery_120168.png" id="galleryIcon" alt="Posts" /></a>
                                {this.state.postPage && <Redirect to={"/profile/" + this.state.id} />}
                            </li>
                            <li className="nav-item">
                                <a onClick={this.goSavedPage} className="nav-link py-4"><img src="https://www.flaticon.com/svg/static/icons/svg/84/84510.svg" id="bookMarkIcon" alt="Saved" /></a>
                                {this.state.savedPage && <Redirect to={'/saved/' + this.state.id} />}
                            </li>
                            <li className="nav-item">
                                <a className="nav-link py-4 active"><img src="https://icon-library.net/images/white-gear-icon-png/white-gear-icon-png-13.jpg" id="gearIcon" alt="Settings" /></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <form className="settingsContainer">
                    <h1>Update Profile</h1>
                    <div className="form-group">
                        <label htmlFor="name" className="mt-3">Username</label>
                        <input type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })} />
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
                        <input type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={e => this.setState({ password: e.target.value })} />
                    </div>
                    {this.state.password !== '' &&
                        <div>
                            {this.passwordsDoNotMatch() && <p className="text-danger">Passwords do not match!</p>}
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control mb-2"
                                value={this.state.confirmPassword}
                                onChange={e => this.setState({ confirmPassword: e.target.value })} />
                        </div>
                    }
                    <div className="form-group">
                        <label htmlFor="imgUrl">Profile Picture URL</label>
                        <input type="text"
                            id="imgUrl"
                            name="imgUrl"
                            className="form-control"
                            value={this.state.imageUrl}
                            onChange={e => this.setState({ imageUrl: e.target.value })} />
                    </div>
                    <br></br>
                    <button id="settingsButton" type="button" className="btn btn-primary btn-block" onClick={() => this.updateUserInfo()}>Save</button>
                </form>
            </>
        );
    }
}