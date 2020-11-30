import React from "react";
import { VacationGramAPIClient } from '../Api/VacationGramAPIClient';
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

    apiClient = new VacationGramAPIClient();

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
            user_id: this.props.match.params.id,
            curr_username: "",
            username: '',
            origin: '',
            destination: '',
            price: '',
            reaction: '',
            rating: '',
            newComment: "",
            results: null,
            postModal: false,
            modalPost: this.blankPost,
            modalPostLiked: false,
            modalPostNumLikes: 0,
            modalPostSaved: false,
            viewOtherProfile: false,
            otherProfileId: null,
            hasSearched: false
        }
    }

    prices = ["$", "$$", "$$$", "$$$$", "$$$$$"];
    ratings = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];
    reactions = ["fun", "boring", "exciting", "scary"]

    getPrice(dbPrice) {
        return this.prices[dbPrice - 1];
    }
    getRating(dbRating) {
        return this.ratings[dbRating - 1];
    }
    getReaction(dbReaction) {
        return this.reactions[dbReaction - 1];
    }
    getDbPrice(price) {
        return this.prices.indexOf(price) + 1;
    }
    getDbRating(rating) {
        return this.ratings.indexOf(rating) + 1;
    }
    getDbReaction(reaction) {
        return this.reactions.indexOf(reaction) + 1;
    }
    prettyPrintDate(dbDate) {
        let date = new Date(dbDate);
        let mydate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        return mydate;
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
    async postComment() {
        await this.apiClient.postComment(this.state.modalPost.post_id, this.state.user_id, this.state.newComment).then(comment => {
            return comment.info[0];
        });
    }
    onNewComment() {
        var commentReturn = this.postComment();
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mycomment = new Comment(
            commentReturn.id, this.state.modalPost.id, this.state.user_id, this.state.curr_username, null, null, date, this.state.newComment, 0, false
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
    async likeTrip(trip_id) {
        await this.apiClient.likeTrip(trip_id, this.state.user_id);
    }
    async unlikeTrip(trip_id) {
        await this.apiClient.unlikeTrip(trip_id, this.state.user_id);
    }
    onClickFeedLikeButton = (post) => {
        if (post.curr_user_liked) {
            this.unlikeTrip(post.post_id);
            post.curr_user_liked = false;
            post.numlikes--;
            this.setState({ modalPostLiked: false });
            this.setState({ modalPostNumLikes: this.state.modalPostNumLikes - 1 });
        } else {
            this.likeTrip(post.post_id);
            post.curr_user_liked = true;
            post.numlikes++;
            this.setState({ modalPostLiked: true });
            this.setState({ modalPostNumLikes: this.state.modalPostNumLikes + 1 });
        }
    }
    async saveTrip(trip_id) {
        await this.apiClient.addSavedTrip(this.state.user_id, trip_id);
    }
    async unsaveTrip(trip_id) {
        await this.apiClient.removeSavedTrip(this.state.user_id, trip_id);
    }
    onClickSaveButton = (post) => {
        if (post.curr_user_saved) {
            this.unsaveTrip(post.post_id);
            post.curr_user_saved = false;
            this.setState({ modalPostSaved: false });
        } else {
            this.saveTrip(post.post_id);
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
    async deleteComment(trip_id, comment_id) {
        await this.apiClient.deleteComment(trip_id, comment_id);
    }
    onCommentDeletion = (postid, comments, commentid) => {
        this.deleteComment(postid, commentid);
        var postsArr = this.state.results;
        for (let p = 0; p < postsArr.length; p++) {//find the post
            if (postsArr[p].id === postid) {
                postsArr[p].comments = comments;
            }
        }
        this.setState({ results: postsArr });
    }
    async onLikeComment(comment_id) {
        var curr_user_liked = false;
        await this.apiClient.getCommentLikes(this.state.modalPost.post_id, comment_id).then(users => {
            for (let u = 0; u < users.count; u++) {
                let user = users.info[u];
                if (user == this.state.user_id) {
                    curr_user_liked = true;
                }
            }
        });
        if (curr_user_liked == true) {
            await this.apiClient.unlikeComment(this.state.modalPost.post_id, comment_id, this.state.user_id);
        } else if (curr_user_liked == false) {
            await this.apiClient.likeComment(this.state.modalPost.post_id, comment_id, this.state.user_id);
        }
    }
    onLikeCommentButton = (comment_id) => {
        this.onLikeComment(comment_id);
    }
    postIsDeletable = (poster_id) => {
        if (poster_id == this.state.user_id) return true;
        return false;
    }
    async deleteTrip(post_id) {
        await this.apiClient.deleteTrip(post_id);
    }
    deletePost = (post_id) => {
        this.deleteTrip(post_id);
        var postsArr = this.state.results;
        for (let i = 0; i < postsArr.length; i++) {
            let currPost = postsArr[i];
            if (currPost.post_id == post_id) {
                postsArr.splice(i, 1);
            }
        }
        this.setState({ results: postsArr });
        this.postModalClose();
    }

    async search() {
        this.setState({results: null});
        this.setState({hasSearched: true});
        //this is also the load function, so get current username
        await this.apiClient.getUserInfo(this.state.user_id).then(user => {
            this.setState({curr_username: user.info[0].name});
        });

        var searchParams = {};
        if(this.state.username !== ''){
            //figure out username to search by
        }
        if(this.state.origin !== '') searchParams["origin"] = this.state.origin;
        if(this.state.destination !== '') searchParams["destination"] = this.state.destination;
        if(this.state.price !== '') searchParams["price"] = this.getDbPrice(this.state.price);
        if(this.state.rating !== '') searchParams["rating"] = this.getDbRating(this.state.rating);
        if(this.state.reaction !== '') searchParams["reaction_id"] = this.getDbReaction(this.state.reaction);

        console.log(searchParams);

        var searchResults = [];
        var trips;
        await this.apiClient.getAllTrips(searchParams).then(tripsReturned => {
            trips = tripsReturned;
        });
        for(let t = 0; t < trips.count; t++){
            var trip = trips.info[t];

            ///get poster username
            var username;
            await this.apiClient.getUserInfo(trip.user_id).then(user => {
                username = user.info[0].name;
            });

            ///get comments
            var comments;
            var commentsArr = [];
            await this.apiClient.getComments(trip.id).then(commentsReturned => {
                comments = commentsReturned;
            });

            ///get curr_user_liked
            var curr_user_liked;
            await this.apiClient.didUserLikeTrip(trip.id, this.state.user_id).then(resp => {
                curr_user_liked = resp.did_like;
            });

            ///get numlikes
            var numlikes;
            await this.apiClient.getLikes(trip.id).then(likes => {
                numlikes = likes.count;
            });

            ///get curr_user_saved
            var curr_user_saved;
            await this.apiClient.didUserSaveTrip(this.state.user_id, trip.id).then(resp => {
                curr_user_saved = resp.did_save;
            });

            ///Construct Comments
            if(comments.success){
                for(let c = 0; c < comments.count; c++){
                    var comment = comments.info[c];

                    ///get commenter username
                    var commenter;
                    await this.apiClient.getUserInfo(comment.user_id).then(user => {
                        commenter = user.info[0].name;
                    });

                    ///get numCommentLikes and curr_user_liked_comment
                    var numCommentLikes;
                    var curr_user_liked_comment = false;
                    await this.apiClient.getCommentLikes(trip.id, comment.id).then(likes => {
                        numCommentLikes = likes.count;
                        for(let i = 0; i < numCommentLikes; i++){
                            if(this.state.user_id == likes.info[i]) curr_user_liked_comment = true;
                        }
                    });

                    var newComment = new Comment(
                        comment.id, comment.trip_id, comment.user_id, commenter, null, null,
                        comment.date_created, comment.body, numCommentLikes, curr_user_liked_comment
                    );
                    commentsArr.push(newComment);
                }
            }
            commentsArr.sort((a,b) => (a.date_created < b.date_created) ? 1 : -1);

            ///Construct Post
            var post = new post_card(
                trip.id, trip.user_id, username, trip.date_created,
                trip.origin, trip.destination, trip.image_url, trip.body,
                this.getPrice(trip.price), this.getReaction(trip.reaction_id), this.getRating(trip.rating), commentsArr,
                curr_user_liked, numlikes, curr_user_saved
            );
            searchResults.push(post);
        }
        searchResults.sort((a,b) => (a.date < b.date) ? 1 : -1);
        this.setState({results: searchResults});
    }
    componentDidMount() {
        window.scrollTo(0,0);
        document.addEventListener("keydown", this.checkEsc, false);
        console.log("Search mounted, user id: " + this.state.user_id);
    }

    render() {
        return (
            <>
                {this.state.viewOtherProfile && <Redirect to={'/otherprofile/'+this.state.user_id+'/'+this.state.otherProfileId}/>}
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
                                    <button type="button" id="searchButton" className="btn btn-primary" onClick={() => this.search()}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.hasSearched &&
                    <Feed posts={this.state.results} openPost={this.postModalOpen} openProfile={this.openOtherProfile} likePost={this.onClickFeedLikeButton} savePost={this.onClickSaveButton} postIsDeletable={this.postIsDeletable} deletePost={this.deletePost}/>
                }
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
                                {/* <h6>{this.state.modalPost.date}</h6> */}
                                <h6>{this.prettyPrintDate(this.state.modalPost.date)}</h6>
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
                        <CommentList comments={this.state.modalPost.comments} curr_user_id={this.state.user_id} poster_id={this.state.modalPost.user_id} post_id={this.state.modalPost.post_id} handleDeletion={this.onCommentDeletion} onLikeCommentButton={this.onLikeCommentButton}/>
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