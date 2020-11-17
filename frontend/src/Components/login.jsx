import React from 'react';
import './login.css'
import { Redirect, Link } from 'react-router-dom';
import logo from './logo.png';
import { NoverdoseRepo } from '../Api/NoverdoseRepo';
import { LoginButton, ErrorMessage } from './loginButton';


class Login extends React.Component {

    noverdoseRepo = new NoverdoseRepo();

    onLogin() {
        console.log(this.state.email, this.state.password);
        this.noverdoseRepo.login(this.state.email, this.state.password).then(user => {
            console.log(user.id)
            if (user.id !== undefined) {
                this.setState({ authenticated: true });
                console.log(user);
                this.setState({ id: user.id });
            }
            else {
                this.setState({ authenticated: false });
            }
        });

    }
    registerUser = e => {
        this.setState({ register: true });
    }

    state = {
        id: '34',
        username: "DummyUser",
        email: "DummyEmail",
        password: "DummyPassword",
        authenticated: null
    };

    render() {
        return <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-137604632-1"></script>
            <div className="imgcontainer">
                <h1>Welcome to TravelGram!</h1>
                <img src={logo} alt="Avatar" className="avatar"></img>
            </div>

            {this.state.authenticated === false && <ErrorMessage />}

            <div className="login-form">
                <div className="form-group">
                    <label htmlFor="search_name">Email</label>
                    <input type="text"
                        name="Email"
                        className="form-control"
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })} />
                </div>
            </div>
            <div className="login-form">
                <div className="form-group">
                    <label htmlFor="search_name">Password</label>
                    <input type="password"
                        name="Password"
                        className="form-control"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })} />
                </div>
                <button className="btn btn-primary btn-lg btn-block" type="button"
                    onClick={() => this.onLogin()}>Log In</button>
                {this.state.authenticated && <Redirect to={'/home/' + this.state.id} />}
                <br></br>
                <Link to={'register'}>
                    <button className="btn btn-primary btn-lg btn-block" type="button">Register</button>
                </Link>
            </div>
            <Link to={{
                pathname: "/privateSaved/",
                user_id: this.state.id,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }}>Skip to Private Saved</Link>
        </>;
    }

}

export default Login;