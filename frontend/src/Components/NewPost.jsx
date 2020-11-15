import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './NewPost.css';
import NavBar from './navBar';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default class NewPost extends React.Component{
    state = {
        userId: this.props.match.params.id,//use user id somehow
        username: "",//use username somehow
        text: "",
        location: "",
        imgurl: ""
    }

    constructor(props){
        super(props)
        this.state = {
            id: '',
            username: '',
            email: '',
            password: '',
        }
    }

    onSubmit(){
        var dateObj = new Date();
        var date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        //post to database
        
    }

    render(){
        return (
            <>
            <NavBar></NavBar>
            <form>
                <h3>Create a Post</h3>
                <label for="location">Location:</label><br/>
                <input type="text" value={this.state.location} onChange={e => this.setState({location: e.target.value})}/><br/>
                <label for="textInput">Post content:</label><br/>
                <textarea id="textInput" value={this.state.text} onChange={e => this.setState({text: e.target.value})}/><br/>
                <label for="image">Photo URL:</label><br/>
                <input type="text" value={this.state.imgurl} onChange={e => this.setState({imgurl: e.target.value})}/><br/><br/>
                <button type="button" onClick={() => this.onSubmit()}>Post</button>
            </form>
            <p>ID: {this.props.match.params.id}</p>
            </>
        );
    }
}