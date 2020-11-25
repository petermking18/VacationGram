import React from "react";
import { TravelGramRepo } from '../Api/TravelGramRepo';
import NavBar from './NavBar';
import './search.css';
import Feed from './Feed';
import PostModal from './PostModal';
import { post_card } from '../models/post_card'
import CommentList from './CommentList';
import {Comment} from '../models/comment';
import {Rating} from './Rating';
import {Price} from './Price';
import {Redirect} from 'react-router-dom';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export class Search extends React.Component {

    travelGramRepo = new TravelGramRepo();

    blankPost = new post_card(
        0, 0, "", "", "", "", "", "", "", "", "", [], false, 0, false
    );

    dummyPost2 = new post_card(2, 1, "Peter King", "Nov 10 2020",
        "Texas", "Washington, DC", "https://dcist.com/wp-content/uploads/sites/3/2020/07/washington-monument-5266903_1920-1500x1000.jpg",
        "I walked around the National Mall and saw some cool buildings!",
        "$$$$$", "fun", "3 stars", [], false, 1, true);

    constructor(props) {
        super(props)
        this.checkEsc = this.checkEsc.bind(this);
        this.state = {
            user_id: this.props.location.curr_user_id,
            curr_username: "get username from api using user_id",
            username: "",
            origin: "",
            destination: "",
            price: "",
            reaction: "",
            rating: "",
            newComment: "",
            results: [],
            postModal: false,
            modalPost: this.blankPost,
            modalPostLiked: false,
            modalPostNumLikes: 0,
            modalPostSaved: false,
            viewOtherProfile: false,
            otherProfileId: null,
        }
    }

    postModalOpen = (post) => {
        this.setState({ postModal: true });
        this.setState({ modalPost: post });
        this.setState({ modalPostLiked: post.curr_user_liked });
        this.setState({ modalPostNumLikes: post.numlikes });
        this.setState({ modalPostSaved: post.curr_user_saved });
        document.body.style.overflow = "hidden";
    }
    postModalClose = () => {
        this.setState({ postModal: false });
        this.setState({ newComment: "" });
        document.body.style.overflow = "visible";
        this.setState({ results: this.state.results });//pull from api again
    }
    onNewComment() {
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mycomment = new Comment(
            null, this.state.modalPost.id, this.state.user_id, this.state.curr_username, null, null, date, this.state.newComment, 0, false
        );
        this.state.modalPost.comments.unshift(mycomment);
        this.postModalClose();
        this.postModalOpen(this.state.modalPost);
    }
    scrollToAddComment = () => {
        document.newCommentForm.newCommentTA.focus();
        document.getElementById("newcommenttextarea").scrollIntoView();
    }
    onClickFeedCommentButton = (post) => {
        this.postModalOpen(post);
        this.scrollToAddComment();
    }
    onClickFeedLikeButton = (post) => {
        if (post.curr_user_liked) {
            //unlike in database
            post.curr_user_liked = false;
            post.numlikes--;
            this.setState({ modalPostLiked: false });
            this.setState({ modalPostNumLikes: this.state.modalPostNumLikes - 1 });
        } else {
            //like in database
            post.curr_user_liked = true;
            post.numlikes++;
            this.setState({ modalPostLiked: true });
            this.setState({ modalPostNumLikes: this.state.modalPostNumLikes + 1 });
        }
    }
    onClickSaveButton = (post) => {
        if (post.curr_user_saved) {
            //unsave in database
            post.curr_user_saved = false;
            this.setState({ modalPostSaved: false });
        } else {
            //save in database
            post.curr_user_saved = true;
            this.setState({ modalPostSaved: true });
        }
        let p;
        for (p in this.state.results) {
            if (p.post_id === this.state.modalPost.post_id) {
                p.curr_user_saved = this.state.modalPostSaved;
            }
        }
    }
    openOtherProfile = (user_id) => {
        console.log("Should open other profile now: " + user_id);
        this.setState({ otherProfileId: user_id, viewOtherProfile: true });
    }
    checkEsc(event) {
        if (event.keyCode === 27) {
            this.postModalClose();
        }
    }
    onCommentDeletion = (postid, comments) => {
        var postsArr = this.state.results;
        for (let p = 0; p < postsArr.length; p++) {//find the post
            if (postsArr[p].id === postid) {
                postsArr[p].comments = comments;
            }
        }
        this.setState({ results: postsArr });
    }

    search(username, origin, destination, price, reaction, rating) {
        username = '"' + username + '"';
        this.travelGramRepo.search(username, origin, destination, price, reaction, rating).then(returnResults => {
            console.log(returnResults);
            this.setState({ results: returnResults });
        });
    }
    componentDidMount() {
        document.addEventListener("keydown", this.checkEsc, false);
        console.log("Search mounted, user id: " + this.state.user_id);
        this.setState({ results: [this.dummyPost2, this.dummyPost2, this.dummyPost2, this.dummyPost2] });
    }

    render() {
        return (
            <>
                {this.state.viewOtherProfile && 
                <Redirect to={{
                    pathname: "/otherprofile/",
                    curr_user_id: this.state.user_id,
                    other_user_id: this.state.otherProfileId,
                    prevPath: "/search/"
                }}/>}
                <NavBar id={this.state.user_id} />
                <div className="container">
                    <div className="card mt-4 mb-3">
                        <div className="card-body">
                            <h3 className="card-title">Search TravelGram </h3>
                            <div className="row form-group">
                                <div className="col">
                                    <label >Username</label>
                                    <input type="text"
                                        className="form-control"
                                        value={this.state.username}
                                        onChange={e => this.setState({ username: e.target.value })} />
                                </div>
                                <div id="collapse"></div>
                                <div className="col">
                                    <label>Origin</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.origin}
                                        onChange={e => this.setState({ origin: e.target.value })} />
                                </div>
                                <div className="col">
                                    <label>Destination</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.destination}
                                        onChange={e => this.setState({ destination: e.target.value })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col" id="originRow">
                                    <br />
                                    <label>Price</label>
                                    <select
                                        className="form-control"
                                        value={this.state.price}
                                        onChange={e => this.setState({ price: e.target.value })}>
                                        <option> </option>
                                        <option value='1'>$</option>
                                        <option value='2'>$$</option>
                                        <option value='3'>$$$</option>
                                        <option value='4'>$$$$</option>
                                        <option value='5'>$$$$$</option>
                                    </select>
                                </div>
                                <div className="form-group col" id="originRow">
                                    <br />
                                    <label>Rating</label>
                                    <select
                                        className="form-control"
                                        value={this.state.rating}
                                        onChange={e => this.setState({ rating: e.target.value })}>
                                        <option> </option>
                                        <option value='1'>1 star</option>
                                        <option value='2'>2 stars</option>
                                        <option value='3'>3 stars</option>
                                        <option value='4'>4 stars</option>
                                        <option value='5'>5 stars</option>
                                    </select>
                                </div>
                                <div id="collapse"></div>
                                <div className="form-group col" id="originRow">
                                    <br />
                                    <label >Reaction</label>
                                    <select
                                        className="form-control"
                                        value={this.state.reaction}
                                        onChange={e => this.setState({ reaction: e.target.value })}>
                                        <option> </option>
                                        <option>fun</option>
                                        <option>boring</option>
                                        <option>exciting</option>
                                        <option>scary</option>
                                    </select>
                                </div>
                                <div className="col" id="originRow">
                                    <br /><br />
                                    <button type="button" id="searchButton" className="btn btn-primary" onClick={() => this.search(this.state.name, this.state.disease, this.state.symptom, this.state.minPrice, this.state.maxPrice, this.state.sideEffect, this.state.pharmacy)}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Feed posts={this.state.results} openPost={this.postModalOpen} openProfile={this.openOtherProfile} likePost={this.onClickFeedLikeButton} savePost={this.onClickSaveButton} />
                <PostModal id="postmodal" show={this.state.postModal} handleClose={e => this.postModalClose(e)}>
                    <div className="" id="modalcontainer">
                        <h3>{this.state.modalPost.origin} ✈ {this.state.modalPost.destination}</h3>
                        <div className="row py-1">
                            <div className="col">
                                <h5>{this.state.modalPost.username}</h5>
                            </div>
                            <div className="col text-right text-muted">
                                <Rating value={this.state.modalPost.rating} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-muted">
                                <h6>{this.state.modalPost.date}</h6>
                            </div>
                            <div className="col text-right text-muted">
                                <Price value={this.state.modalPost.price} />
                            </div>
                        </div>
                        <div className="row py-1">
                            <img id="modalimg" src={this.state.modalPost.imgurl} />
                        </div>
                        <div className="row py-3">
                            <div className="col">
                                <p>{this.state.modalPost.text}</p>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col">
                                {/* <button type="button" className="btn mr-2" id="likebutton">
                                👍 Like
                                </button> */}
                                <button type="button" onClick={() => this.onClickFeedLikeButton(this.state.modalPost)} className="btn mr-2" id="likebutton">
                                    👍 {!this.state.modalPostLiked && "Like (" + this.state.modalPostNumLikes + ")"}{this.state.modalPostLiked && "Unlike (" + this.state.modalPostNumLikes + ")"}
                                </button>
                                <button type="button" className="btn mr-2" id="commentbutton" onClick={this.scrollToAddComment}>
                                    Comment
                                </button>
                                <button type="button" onClick={() => this.onClickSaveButton(this.state.modalPost)} className="btn mr-2" id="savebutton">
                                    {!this.state.modalPostSaved && "Save"}{this.state.modalPostSaved && "Unsave"}
                                </button>
                            </div>
                        </div>
                        <CommentList comments={this.state.modalPost.comments} curr_user_id={this.state.user_id} poster_id={this.state.modalPost.user_id} post_id={this.state.modalPost.post_id} handleDeletion={this.onCommentDeletion} />
                        <form className="row mt-0 ml-0 pl-0" name="newCommentForm">
                            <div className="ml-0 pl-0" id="newcommenttextarea">
                                <textarea name="newCommentTA" type="text" className="form-control mb-3" placeholder="add a comment" id="newcomment"
                                    value={this.state.newComment}
                                    onChange={e => this.setState({ newComment: e.target.value })} required />
                            </div>
                            <div className="col text-right">
                                {this.state.newComment == "" &&
                                    <button type="button" className="btn mt-2 mr-4" id="newCommentButtonInactive">Post Comment</button>
                                }
                                {this.state.newComment != "" &&
                                    <button type="button" className="btn btn-secondary mt-2 mr-4" id="newCommentButton" onClick={() => this.onNewComment()}>Post Comment</button>
                                }
                            </div>
                        </form>
                    </div>
                </PostModal>
            </>
        );
    }
}

export default Search;