import React from 'react';
import { post_card } from '../models/post_card';
import './PostCard.css';
import { Rating } from './Rating'
import { Price } from './Price'

//props will be post card
/* export const Feed = (props) => (
    <>
        <h4>{props.thePost.username}</h4>
    </>
); */
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
                    <div className="bg-light py-2 border-bottom pl-3">
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
                                {post.username}
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
                                <img src={post.imgurl} />
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
                                <button type="button" className="btn" id="commentbutton">
                                    Comment
                                </button>
                            </div>
                            <div className="col pr-5 text-right pt-2">
                                {post.comments.length === 1 && (<p>1 comment</p>)}
                                {post.comments.length != 1 && (<p>{post.comments.length} comments</p>)}
                            </div>
                        </div>
                    </div>
                </li>
            </>
        );
    }
}