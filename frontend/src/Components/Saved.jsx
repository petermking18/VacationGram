import React from 'react';
import { post_card } from '../models/post_card';
import { Comment } from '../models/comment';
import { Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import { Rating } from './Rating';
import { Price } from './Price';
import CommentList from './CommentList';
import './Saved.css';
import Feed from './Feed';
import { VacationGramAPIClient } from '../Api/VacationGramAPIClient';
import PostModal from './PostModal';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default class Saved extends React.Component {
    dummyComment1 = new Comment(1, 1, 75, "Pete", 1, false, "Nov 11 2020", "Very cool trip!", 5, false);
    dummyComment2 = new Comment(2, 2, 2, "John Lawrimore", 2, false, "Nov 12 2020", "Seems like you had fun", 2, false);
    dummyPost1 = new post_card(1, 2, "Mark Fontenot", "Nov 9 2020",
        "Dallas", "Hawaii", "https://lp-cms-production.imgix.net/2019-06/c05b829af5ee38ab1917f335d937f8e1-hawaii.jpg?auto=compress&fit=crop&fm=auto&sharp=10&vib=20&w=1200",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "$$$", "happy", "4 stars", [this.dummyComment1, this.dummyComment2], true, 12, true);
    dummyPosts = [this.dummyPost1, this.dummyPost1];
    blankPost = new post_card(
        0, 0, "", "", "", "", "", "", "", "", "", [], false, 0, false
    );
    apiClient = new VacationGramAPIClient();

    constructor(props) {
        super(props)
        this.checkEsc = this.checkEsc.bind(this);
        this.state = {
            user_id: this.props.match.params.id,
            username: "",
            newComment: "",
            postModal: false,
            modalPost: this.blankPost,
            modalPostLiked: false,
            modalPostNumLikes: 0,
            modalPostSaved: false,
            posts: null,
            postPage: false,
            settingsPage: false,
            otherProfileId: null,
            viewOtherProfile: false,
        }
    }

    goPostPage = e => {
        this.setState({ postPage: true });
    }
    goSettingsPage = e => {
        this.setState({ settingsPage: true });
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
        this.setState({ posts: this.state.posts });//pull from api again
    }
    onNewComment() {
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        console.log("commenter: " + this.state.user_id);
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
    onClickFeedCommentButton = (post) => {
        this.postModalOpen(post);
        this.scrollToAddComment();
        console.log(this.state.user_id);
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
            for (let i = 0; i < this.state.posts.length; i++) {
                if (post.id === this.state.posts[i].id) this.state.posts.splice(i, 1);
            }
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
    openOtherProfile = (user_id) => {
        console.log("Should open other profile now: " + user_id);
        this.setState({ otherProfileId: user_id, viewOtherProfile: true });
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
    checkEsc(event) {
        if (event.keyCode === 27) {
            this.postModalClose();
            this.setState({ postForm: false });
            this.setState({ origin: "" });
            this.setState({ destination: "" });
            this.setState({ imgurl: "" });
            this.setState({ text: "" });
            this.setState({ price: "" });
            this.setState({ reaction: "" });
            this.setState({ rating: "" });
            document.body.style.overflow = "visible";
        }
    }
    async deleteTrip(post_id) {
        await this.apiClient.deleteTrip(post_id);
    }
    deletePost = (post_id) => {
        this.deleteTrip(post_id);
        var postsArr = this.state.posts;
        for (let i = 0; i < postsArr.length; i++) {
            let currPost = postsArr[i];
            if (currPost.post_id == post_id) {
                postsArr.splice(i, 1);
            }
        }
        this.setState({ posts: postsArr });
        this.postModalClose();
    }
    postIsDeletable = (poster_id) => {
        if (poster_id == this.state.user_id) return true;
        return false;
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        document.addEventListener("keydown", this.checkEsc, false);
        console.log("Saved mounted, user id: " + this.props.match.params.id);
    }

    render() {
        return <>
            {this.state.viewOtherProfile && <Redirect to={'/otherprofile/' + this.state.user_id + '/' + this.state.otherProfileId} />}
            <NavBar id={this.state.user_id} />
            <div className="container boostrap-snippet header-container">
                <div className="bg-white">
                    <div className="container pt-0">
                        <div className="media col-md-10 cold-lg-8 col-xl-7 p-0 mb-4 mx-auto">
                            <img src="https://www.smu.edu/-/media/Images/News/Experts/Mark-Fontenot.jpg?la=en" className="d-block ui-w-100 rounded circle mt-4" id="profImg" />
                        </div>
                        <div className="profUsername">
                            <h4 className="font-weight-bold mb-4">Mark Fontenot</h4>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <ul className="nav nav-tabs tabs-alt justify-content-center">
                        <li className="nav-item">
                            <a onClick={this.goPostPage} className="nav-link py-4"><img src="https://cdn.icon-icons.com/icons2/1875/PNG/512/imagegallery_120168.png" id="galleryIcon" /></a>
                            {this.state.postPage && <Redirect to={'/profile/' + this.state.user_id} />}
                        </li>
                        <li className="nav-item">
                            <a onClick={this.goSavedPage} className="nav-link py-4 active"><img src="https://www.flaticon.com/svg/static/icons/svg/84/84510.svg" id="bookMarkIcon" /></a>
                        </li>
                        <li className="nav-item">
                            <a onClick={this.goSettingsPage} className="nav-link py-4"><img src="https://icon-library.net/images/white-gear-icon-png/white-gear-icon-png-13.jpg" id="gearIcon" /></a>
                            {this.state.settingsPage && <Redirect to={'/settings/' + this.state.user_id} />}
                        </li>
                    </ul>
                </div>
            </div>
            <Feed posts={this.state.posts} openPost={this.postModalOpen} openProfile={this.openOtherProfile} likePost={this.onClickFeedLikeButton} savePost={this.onClickSaveButton} postIsDeletable={this.postIsDeletable} />
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
                    <CommentList comments={this.state.modalPost.comments} curr_user_id={this.state.user_id} poster_id={this.state.modalPost.user_id} handleDeletion={this.onCommentDeletion} />
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