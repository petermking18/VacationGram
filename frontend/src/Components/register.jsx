import React from 'react';
import './register.css'
import logo from './logo.png';
import User from './../models/user';
import { VacationGramAPIClient } from './../Api/VacationGramAPIClient';
import { RegisterButton } from './loginButton';
import { Redirect } from 'react-router-dom';
import { LoginButton, RegisterErrorMessage, RegisterErrorMessage2 } from './loginButton';


export class RegisterPage extends React.Component {

    apiClient = new VacationGramAPIClient();


    state = {
        id: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicUrl: '',
        registered: undefined,
        register2: undefined,
        confirm: null
    };

    /* registerUser(username, email, password, confirmPassword, profilePicUrl) {
        if (password === confirmPassword) {
            this.setState({ confirm: true });
            this.VacationGramAPIClient.searchUser(email)
                .then(resp => {
                    if (resp.data.length == 0) {
                        this.VacationGramAPIClient.addUser(username, email, password)//add profilePicUrl
                            .then(accountId => {
                                new User(accountId, username, email, password, this.state.profilePicUrl)
                                console.log(accountId);
                                this.setState({ id: accountId.id });
                                this.setState({ registered: true });
                            });
                    }
                    else {
                        this.setState({ register2: false });

                    }
                });
        }
        else {
            this.setState({ registered: false });
        }
    } */
    readyToRegister() {
        if (this.state.username !== ''
            && this.state.email !== ''
            && this.state.password !== ''
            && this.state.confirmPassword === this.state.password) return true;
        return false;
    }

    registerUser(username, email, password, confirmPassword, profilePicUrl) {
        if (profilePicUrl === '') profilePicUrl = "https://st.depositphotos.com/1779253/5140/v/600/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg";
        if (this.readyToRegister()) {
            this.setState({ confirm: true });
            this.apiClient.register(username, email, password, profilePicUrl)
                .then(user => {
                    console.log(user.info[0].id);
                    this.setState({ id: user.info[0].id });
                    this.setState({ registered: true });
                });
        }
    }

    passwordsDoNotMatch() {
        if (this.state.confirmPassword !== '') {
            if (this.state.confirmPassword !== this.state.password) {
                return true;
            }
        }
        return false;
    }

    render() {
        return <>
            <div id="loginPageBG">
                <div className="fadeInDown" id="loginWrapper">
                    <div id="loginFormContent">
                        <form className="container">
                            <div className="imgcontainer pt-3">
                                <h1>Register</h1>
                                <img src={logo} alt="Avatar" className="avatar"></img>
                            </div>
                            {this.state.registered == false && <RegisterErrorMessage />}
                            {this.state.register2 == false && <RegisterErrorMessage2 />}
                            <div className="login-form">
                                <div className="form-group">
                                    {/* <label htmlFor="search_name" className="py-0">Username</label> */}
                                    {/* <span className="text-danger"> *</span> */}
                                    <input type="text"
                                        name="Email"
                                        className="form-control"
                                        placeholder="username"
                                        value={this.state.username}
                                        onChange={e => this.setState({ username: e.target.value })} />
                                </div>
                            </div>

                            <div className="login-form">
                                <div className="form-group">
                                    {/* <label htmlFor="search_name" className="py-0">Email</label> */}
                                    {/* <span className="text-danger"> *</span> */}
                                    <input type="text"
                                        name="Email"
                                        className="form-control"
                                        placeholder="email"
                                        value={this.state.email}
                                        onChange={e => this.setState({ email: e.target.value })} />
                                </div>
                            </div>
                            <div className="login-form">
                                <div className="form-group">
                                    {/* <label htmlFor="search_name" className="py-0">Password</label> */}
                                    {/* <span className="text-danger"> *</span> */}
                                    <input type="password"
                                        name="Password"
                                        className="form-control"
                                        placeholder="password"
                                        value={this.state.password}
                                        onChange={e => this.setState({ password: e.target.value })} />
                                </div>
                            </div>

                            <div className="login-form">
                                <div className="form-group">
                                    {/* <label htmlFor="search_name" className="py-0">Confirm Password</label> */}
                                    {/* <span className="text-danger"> *</span> */}
                                    {this.passwordsDoNotMatch() && <p className="text-danger">Passwords do not match</p>}
                                    <input type="password"
                                        name="Password"
                                        className="form-control"
                                        placeholder="confirm password"
                                        value={this.state.confirmPassword}
                                        onChange={e => this.setState({ confirmPassword: e.target.value })} />
                                </div>
                            </div>

                            <div className="login-form">
                                <div className="form-group">
                                    {/* <label htmlFor="profPicUrl" className="py-0">Profile Picture URL</label> */}
                                    <input type="text"
                                        className="form-control"
                                        placeholder="profile picture url (optional)"
                                        value={this.state.profilePicUrl}
                                        onChange={e => this.setState({ profilePicUrl: e.target.value })} />
                                </div>
                            </div>

                            <div className="login-form pb-4">
                                <button className="btn btn-primary btn-lg btn-block" type="button" onClick={() => this.registerUser(this.state.username, this.state.email, this.state.password, this.state.confirmPassword, this.state.profilePicUrl)}>Register</button>
                                {this.state.registered && <Redirect to={'/profile/' + this.state.id} />}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>;
    }
}

export default RegisterPage;