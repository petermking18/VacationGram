import React from 'react';
import { post_card } from '../models/post_card';
import './PostCard.css';
import { Rating } from './Rating'
import { Price } from './Price'
import { Redirect, Link } from 'react-router-dom';

export default class PostCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numlikes: this.props.thePost.numlikes,
            curr_user_liked: this.props.thePost.curr_user_liked,
            curr_user_saved: this.props.thePost.curr_user_saved,
        }
    }

    clickLike(){
        this.props.likeButton(this.props.thePost);
        this.setState({numlikes: this.props.thePost.numlikes});
        this.setState({curr_user_liked: this.props.thePost.curr_user_liked});
    }

    clickSave(){
        this.props.saveButton(this.props.thePost);
        this.setState({curr_user_saved: this.props.thePost.curr_user_saved});
    }

    render() {
        var { thePost } = this.props;
        var post = thePost;
        return (
            <>
                <li className="container rounded border border-secondary-50 border-top px-0 mt-3">
                    {/* Top area: origin, dest, username, date, rating, price */}
                    <div onClick={() => this.props.postModalOpen(post)} id="postheader" className="bg-light py-2 border-bottom pl-3">
                        <div className="row">
                            <div className="col">
                                <p id="origindest">{post.origin} ✈ {post.destination}</p>
                            </div>
                            <div className="col text-right text-muted pr-5">
                                <Rating value={post.rating} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>{post.username}</p>
                            </div>
                            <div className="col text-right text-muted pr-5">
                                <Price value={post.price} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-muted">
                                {post.date}
                            </div>
                        </div>
                    </div>
                    {/* Middle area: image, text */}
                    <div className="pl-3 py-2">
                        <div className="row py-2">
                            <div className="col">
                                <img id="postcardimg" src={post.imgurl} />
                            </div>
                            <div className="col-9 pl-1 pr-5">
                                <p>{post.text}</p>
                            </div>
                        </div>
                    </div>
                    {/* Bottom area: like button, comment button, save button, numlikes, numcomments */}
                    <div className="bg-light py-2 border-top pl-3">
                        <div className="row">
                            <div className="col">
                                <button type="button" onClick={() => this.clickLike(post)} className="btn mr-2" id="likebutton">
                                👍 {!this.state.curr_user_liked && "Like"}{this.state.curr_user_liked && "Unlike"}
                                </button>
                                <button type="button" onClick={() => this.props.commentButton(post)} className="btn mr-2" id="commentbutton">
                                    Comment
                                </button>
                                <button type="button" onClick={() => this.clickSave(post)} className="btn mr-2" id="savebutton">
                                {!this.state.curr_user_saved && "Save"}{this.state.curr_user_saved && "Unsave"}
                                </button>
                            </div>
                            <div className="col-4 pr-5 text-right pt-2">
                                {this.state.numlikes === 1 && (<t className="mr-3" onClick={() => this.props.postModalOpen(post)} id="numlikes">1 like</t>)}
                                {this.state.numlikes != 1 && (<t className="mr-3" onClick={() => this.props.postModalOpen(post)} id="numlikes">{this.state.numlikes} likes</t>)}
                                {post.comments.length === 1 && (<t onClick={() => this.props.postModalOpen(post)} id="numcomments">1 comment</t>)}
                                {post.comments.length != 1 && (<t onClick={() => this.props.postModalOpen(post)} id="numcomments">{post.comments.length} comments</t>)}
                            </div>
                        </div>
                    </div>
                </li>
            </>
        );
    }
}