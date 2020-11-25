import React from 'react';
import './otherProfile.css';
import NavBar from './NavBar';

//Props: curr_user_id, other_user_id
export default class OtherProfile extends React.Component{
    render(){
        return <>
        <NavBar id={this.props.location.curr_user_id}/>
        <br/>
        <br/>
        <br/>
        <br/>
        Profile to render: {this.props.location.other_user_id}
        </>
    }
}