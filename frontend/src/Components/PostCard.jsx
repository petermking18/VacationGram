import React from 'react';
import { post_card } from '../models/post_card';
import './PostCard.css';
import { Rating } from './Rating'
import { Price } from './Price'
import { Redirect, Link } from 'react-router-dom';

export default class PostCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { thePost } = this.props;
        const post = thePost;
        return (
            <>
                <li className="container rounded border border-secondary-50 border-top px-0 mt-3">
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
                    <div className="bg-light py-2 border-top pl-3">
                        <div className="row">
                            <div className="col">
                                <button type="button" className="btn mr-2" id="likebutton">
                                    Like
                                </button>
                                <button type="button" onClick={() => this.props.commentButton(post)} className="btn mr-2" id="commentbutton">
                                    Comment
                                </button>
                                <button type="button" className="btn mr-2" id="savebutton">
                                    Save
                                </button>
                            </div>
                            <div className="col-3 pr-5 text-right pt-2">
                                {post.comments.length === 1 && (<p onClick={() => this.props.postModalOpen(post)} id="numcomments">1 comment</p>)}
                                {post.comments.length != 1 && (<p onClick={() => this.props.postModalOpen(post)} id="numcomments">{post.comments.length} comments</p>)}
                            </div>
                        </div>
                    </div>
                </li>
            </>
        );
    }
}