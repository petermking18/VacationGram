import React from 'react';
import './Feed.css';
import { Rating } from './Rating';
import { Price } from './Price';

//Props: array posts, func openPost(post), func openProfile(user id), 
//       func likePost(post), func savePost(post), boolean needsPaddingY
export default class Feed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: this.props.posts
        }
    }
    componentDidMount() {
        this.setState({ posts: this.props.posts });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ posts: nextProps.posts });
    }
    render() {
        return <>
            <ul className="feed bg-white list-unstyled">
                {this.state.posts.map((post, index) => (
                    <li key={index} className="container rounded border border-secondary-50 border-top px-0 mt-3">
                        {/* Top area: origin, dest, username, date, rating, price */}
                        <div className="bg-light border-bottom pl-3" id="topclickablearea">
                            <div className="row pt-2" onClick={() => this.props.openPost(post)}>
                                <div className="col">
                                    <p id="origindest">{post.origin} <span>✈️</span> {post.destination}</p>
                                </div>
                                <div className="col text-right text-muted pr-5">
                                    <Rating value={post.rating} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <p id="username" onClick={() => this.props.openProfile(post.user_id)}>{post.username}</p>
                                </div>
                                <div className="col text-right text-muted pr-5" onClick={() => this.props.openPost(post)}>
                                    <Price value={post.price} />
                                </div>
                            </div>
                            <div className="row" onClick={() => this.props.openPost(post)}>
                                <div className="col text-muted">
                                    {post.date}
                                </div>
                            </div>
                        </div>
                        {/* Middle area: image, text */}
                        <div className="pl-3 py-2">
                            <div className="row py-2">
                                <div className="col" id="postcardimgcol">
                                    <img id="postcardimg" src={post.imgurl} alt="Trip" />
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
                                    <button type="button" onClick={() => this.props.likePost(post)} className="btn mr-2" id="likebutton">
                                        <span role="img" aria-label="thumbs up">👍 </span> {!post.curr_user_liked && "Like"}{post.curr_user_liked && "Unlike"}
                                    </button>
                                    <button type="button" onClick={() => this.props.openPost(post)} className="btn mr-2" id="commentbutton">
                                        Comment
                                    </button>
                                    <button type="button" onClick={() => this.props.savePost(post)} className="btn mr-2" id="savebutton">
                                        {!post.curr_user_saved && "Save"}{post.curr_user_saved && "Unsave"}
                                    </button>
                                </div>
                                <div className="col-4 pr-5 text-right pt-2" id="numlikesnumcomments">
                                    {post.numlikes === 1 && (<p className="mr-3" onClick={() => this.props.openPost(post)} id="numlikes">1 like</p>)}
                                    {post.numlikes !== 1 && (<p className="mr-3" onClick={() => this.props.openPost(post)} id="numlikes">{post.numlikes} likes</p>)}
                                    {post.comments.length === 1 && (<p onClick={() => this.props.openPost(post)} id="numcomments">1 comment</p>)}
                                    {post.comments.length !== 1 && (<p onClick={() => this.props.openPost(post)} id="numcomments">{post.comments.length} comments</p>)}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    }

}