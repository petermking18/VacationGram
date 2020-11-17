import React from 'react';
import './privateSaved.css'
import PostCard from './PostCard';

export default class PrivateSaved extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <>
            <ul class="feed" className="mt-1 bg-light list-unstyled bg-white" id="homefeed">
                {this.props.thePosts.map((post, index) => (
                    <PostCard thePost={post} likeButton={this.props.likeButton}
                    commentButton={this.props.commentButton} postModalOpen={this.props.postModalOpen}
                    saveButton={this.props.saveButton}/>
                ))}
            </ul>
            </>
        );
    }
}