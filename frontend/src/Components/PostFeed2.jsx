import React from 'react';
import './PostFeed.css'
import PostCard from './PostCard2';

export default class PostFeed extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            posts: this.props.thePosts,
        }
    }

    render(){
        return (
            <>
            <ul class="feed" className="mt-1 bg-light list-unstyled bg-white" id="homefeed">
                {this.state.posts.map((post, index) => (
                    <PostCard thePost={post} likeButton={this.props.likeButton}
                    commentButton={this.props.commentButton} postModalOpen={this.props.postModalOpen}
                    saveButton={this.props.saveButton}/>
                ))}
            </ul>
            </>
        );
    }
}