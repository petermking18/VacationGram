import React from 'react';
import { profile_head } from '../models/profile_head';
import './profileHeader.css';

export class ProfileHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: '',
            username: '',
            imageUrl: '',
        }
    }

    render(){
        return <>
        <div>
            <h1>hello</h1>
        </div>
        </>
    }
}

export default ProfileHeader;