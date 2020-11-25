import React from 'react';
import './otherProfile.css';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';
import { post_card } from '../models/post_card';
import PostModal from './PostModal';
import CommentList from './CommentList';
import { Rating } from './Rating';
import { Price } from './Price';
import Feed from './Feed';
import { User } from '../models/user';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

//Props: curr_user_id, other_user_id
export default class OtherProfile extends React.Component {
    dummyComment1 = new Comment(1, 1, 75, "Pete", 1, false, "Nov 11 2020", "Very cool trip!", 5, false);
    dummyComment2 = new Comment(2, 2, 2, "John Lawrimore", 2, false, "Nov 12 2020", "Seems like you had fun", 2, false);
    dummyPost1 = new post_card(1, 2, "Mark Fontenot", "Nov 9 2020",
        "Dallas", "Hawaii", "https://lp-cms-production.imgix.net/2019-06/c05b829af5ee38ab1917f335d937f8e1-hawaii.jpg?auto=compress&fit=crop&fm=auto&sharp=10&vib=20&w=1200",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "$$$", "happy", "4 stars", [this.dummyComment1, this.dummyComment2], true, 12, false);
    blankPost = new post_card(
        0, 0, "", "", "", "", "", "", "", "", "", [], false, 0, false
    );
    dummmyUser1 = new User(35, "Mark Fontenot", "Dallas", "I'm a professor and I have two dogs!", "", "", "", "https://s2.smu.edu/~mfonten/img/FontenotSM.jpg");


    constructor(props) {
        super(props)
        this.checkEsc = this.checkEsc.bind(this);
        this.state = {
            curr_user_id: this.props.location.curr_user_id,
            other_user_id: this.props.location.other_user_id,
            user: this.dummmyUser1,
            postModal: false,
            modalPost: this.blankPost,
            modalPostLiked: false,
            modalPostNumLikes: 0,
            modalPostSaved: false,
            origin: "",
            destination: "",
            imgurl: "",
            text: "",
            price: "",
            reaction: "",
            rating: "",
            newComment: "",
            posts: []
        }
    }
    checkEsc(event) {
        if (event.keyCode === 27) {
            this.postModalClose();
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
        this.setState({ postModal: false, newComment: "" })
        document.body.style.overflow = "visible";
        this.setState({ posts: this.state.posts });//pull from api again
    }
    onNewComment() {
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mycomment = new Comment(
            null/*change to new comment id*/, this.state.modalPost.id, this.state.user_id, this.state.username,
            null/*parent id?*/, null/*is question?*/, date, this.state.newComment, 0, false
        );
        this.state.modalPost.comments.unshift(mycomment);
        this.postModalClose();
        this.postModalOpen(this.state.modalPost);
    }
    scrollToAddComment = () => {
        document.newCommentForm.newCommentTA.focus();
        document.getElementById("newcommenttextarea").scrollIntoView();
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
        for (p in this.state.posts) {
            if (p.post_id === this.state.modalPost.post_id) {
                p.curr_user_saved = this.state.modalPostSaved;
            }
        }
    }
    onCommentDeletion = (postid, comments) => {
        var postsArr = this.state.posts;
        for (let p = 0; p < postsArr.length; p++) {//find the post
            if (postsArr[p].id === postid) {
                postsArr[p].comments = comments;
            }
        }
        this.setState({ posts: postsArr });
    }
    openOtherProfile(){

    }

    componentDidMount() {
        document.addEventListener("keydown", this.checkEsc, false);
        this.setState({ posts: [this.dummyPost1,this.dummyPost1,this.dummyPost1] });//fetch user and users posts
        this.setState({ user: this.dummmyUser1 });
    }

    render() {
        return <>
            <NavBar id={this.props.location.curr_user_id} />
            <div className="container bg-gradient-secondary" id="backbutton">
                <Link to={{
                    pathname: this.props.location.prevPath,
                    curr_user_id: this.props.location.curr_user_id,
                }}>
                    <button type="button" className="my-1 btn btn-light">
                        ← back
                </button>
                </Link>
            </div>
            {/* <div className="container">
                Profile id to render: {this.props.location.other_user_id}
            </div> */}
            <div className="container bootstrap-snippet header-container">
                <div className="bg-white">
                    <div className="container pt-0">
                        <div className="media col-md-10 cold-lg-8 col-xl-7 p-0 mb-4 mx-auto">
                            <img src={this.state.user.profilePicUrl} className="d-block ui-w-100 rounded circle mt-4" id="profImg" />
                        </div>
                        <div className="profUsername">
                            <h4 className="font-weight-bold mb-4">{this.state.user.name}</h4>
                        </div>
                    </div>
                    <hr className="m-0" />
                </div>
            </div>
            <Feed posts={this.state.posts} openPost={this.postModalOpen} openProfile={this.openOtherProfile} likePost={this.onClickFeedLikeButton} savePost={this.onClickSaveButton} />
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
    }
}