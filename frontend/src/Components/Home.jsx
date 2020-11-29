import React from 'react';
import PostFeed from './PostFeed';
import Feed from './Feed';
import { post_card } from '../models/post_card';
import PostCard from './PostCard';
import { Comment } from '../models/comment';
import './Home.css';
import NavBar from './NavBar';
import PostForm from './PostForm';
import PostModal from './PostModal';
import { Rating } from './Rating';
import { Price } from './Price';
import CommentList from './CommentList';
import { Redirect } from 'react-router-dom';
import { VacationGramAPIClient } from '../Api/VacationGramAPIClient';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export class Home extends React.Component {
    dummyComment1 = new Comment(1, 1, 75, "Pete", 1, false, "Nov 11 2020", "Very cool trip!", 5, false);
    dummyComment2 = new Comment(2, 2, 2, "John Lawrimore", 2, false, "Nov 12 2020", "Seems like you had fun", 2, false);
    dummyPost1 = new post_card(1, 2, "Mark Fontenot", "Nov 9 2020",
        "Dallas", "Hawaii", "https://lp-cms-production.imgix.net/2019-06/c05b829af5ee38ab1917f335d937f8e1-hawaii.jpg?auto=compress&fit=crop&fm=auto&sharp=10&vib=20&w=1200",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "$$$", "happy", "4 stars", [this.dummyComment1, this.dummyComment2], true, 12, false);
    dummyPost2 = new post_card(2, 1, "Peter King", "Nov 10 2020",
        "Texas", "Washington, DC", "https://dcist.com/wp-content/uploads/sites/3/2020/07/washington-monument-5266903_1920-1500x1000.jpg",
        "I walked around the National Mall and saw some cool buildings!",
        "$$$$$", "fun", "3 stars", [], false, 1, true);

    dummyPosts = [this.dummyPost1, this.dummyPost2, this.dummyPost1];
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
            email: "",
            password: "",
            postForm: false,
            origin: "",
            destination: "",
            imgurl: "",
            text: "",
            price: "",
            reaction: "",
            rating: "",
            newComment: "",
            postModal: false,
            modalPost: this.blankPost,
            modalPostLiked: false,
            modalPostNumLikes: 0,
            modalPostSaved: false,
            posts: [],//get from api
            viewOtherProfile: false,
            otherProfileId: null,
        }
    }

    prices = ["$", "$$", "$$$", "$$$$", "$$$$$"];
    ratings = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];
    reactions = ["fun", "boring", "exciting", "scary"]

    readyToPost(){
        if(this.state.origin !== ""
        && this.state.destination !== ""
        && this.state.text !== ""
        && this.state.price !== ""
        && this.state.rating !== ""
        && this.state.imgurl !== ""
        && this.state.reaction !== ""){
            return true;
        }
        return false;
    }
    getPrice(dbPrice){
        return this.prices[dbPrice-1];
    }
    getRating(dbRating){
        return this.ratings[dbRating-1];
    }
    getReaction(dbReaction){
        return this.reactions[dbReaction-1];
    }
    getDbPrice(price){
        return this.prices.indexOf(price)+1;
    }
    getDbRating(rating){
        return this.ratings.indexOf(rating)+1;
    }
    getDbReaction(reaction){
        return this.reactions.indexOf(reaction)+1;
    }

    async loadPosts() {
        //get current username
        await this.apiClient.getUserInfo(this.state.user_id).then(user => {
            this.setState({username: user.info[0].name});
        })

        var postsArr = [];
        var trips;
        await this.apiClient.getAllTrips().then(tripsReturned => {
            trips = tripsReturned;
        });
        for (let t = 0; t < trips.count; t++) {
            var trip = trips.info[t];

            ///get username
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
            })


            ///Construct comments
            if (comments.success) {
                for (let c = 0; c < comments.count; c++) {
                    var comment = comments.info[c];

                    ///get commenter username
                    var commenter;
                    await this.apiClient.getUserInfo(comment.user_id).then(user => {
                        commenter = user.info[0].name;
                    });

                    //get comment numcommentlikes and curr_user_liked_comment
                    var numCommentLikes;
                    var curr_user_liked_comment = false;
                    await this.apiClient.getCommentLikes(trip.id, comment.id).then(likes => {
                        numCommentLikes = likes.count;
                        for(let i = 0; i < numCommentLikes; i++){
                            if(this.state.user_id == likes.info[i]) curr_user_liked_comment = true;
                        }
                    });

                    var newComment = new Comment(
                        comment.id, comment.trip_id, comment.user_id, commenter,
                        null, null, comment.date_created, comment.body, numCommentLikes,
                        curr_user_liked_comment
                    );
                    commentsArr.push(newComment);
                }
            }
            commentsArr.sort((a,b) => (a.date_created < b.date_created) ? 1 : -1);//show newest comments first

            ///Construct post
            var post = new post_card(
                trip.id, trip.user_id, username, trip.date_created,
                trip.origin, trip.destination, trip.image_url, trip.body,
                this.getPrice(trip.price), trip.reaction_id, this.getRating(trip.rating), commentsArr,
                curr_user_liked, numlikes, curr_user_saved
            );
            postsArr.push(post);
        }
        postsArr.sort((a,b) => (a.date < b.date) ? 1 : -1);//show newest posts first
        this.setState({ posts: postsArr });
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

    postFormOpen() {
        this.setState({ postForm: true });
        document.body.style.overflow = "hidden";
    }
    postFormClose = () => {
        this.setState({ postForm: false });
        this.setState({ origin: "" });
        this.setState({ destination: "" });
        this.setState({ imgurl: "" });
        this.setState({ text: "" });
        this.setState({ price: "" });
        this.setState({ reaction: "" });
        this.setState({ rating: "" });
        document.body.style.overflow = "visible";
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    async postTrip(){
        var new_trip_id;
        await this.apiClient.createTrip(this.state.text, this.state.origin, this.state.destination, this.getDbRating(this.state.rating), this.getDbPrice(this.state.price),
            "", this.state.user_id, this.getDbReaction(this.state.reaction), this.state.imgurl).then(trip => {
                new_trip_id = trip.info[0].id;
            });
        return new_trip_id;
    }
    onPost() {
        var new_trip_id = this.postTrip();
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mypost = new post_card(
            new_trip_id, this.state.user_id, this.state.username, date, this.state.origin, this.state.destination, this.state.imgurl,
            this.state.text, this.state.price, this.state.reaction, this.state.rating, [], false, 0, false
        );
        this.state.posts.unshift(mypost);//later this step will post to database
        this.setState(this.state);
        this.postFormClose();
    }
    async postComment(){
        await this.apiClient.postComment(this.state.modalPost.post_id, this.state.user_id, this.state.newComment).then(comment => {
            return comment.info[0];
        });
    }
    onNewComment() {
        var commentReturn = this.postComment();
        let mycomment = new Comment(
            commentReturn.id, this.state.modalPost.post_id, this.state.user_id, this.state.username,
            null/*parent id?*/, null/*is question?*/, commentReturn.date_created, this.state.newComment, 0, false
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
    async likeTrip(trip_id){
        await this.apiClient.likeTrip(trip_id, this.state.user_id);
    }
    async unlikeTrip(trip_id){
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
    async saveTrip(trip_id){
        await this.apiClient.addSavedTrip(this.state.user_id, trip_id);
    }
    async unsaveTrip(trip_id){
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
    prettyPrintDate(dbDate){
        let date = new Date(dbDate);
        let mydate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        return mydate;
    }
    async deleteComment(trip_id, comment_id){
        await this.apiClient.deleteComment(trip_id, comment_id);
    }
    onCommentDeletion = (postid, comments, commentid) => {
        this.deleteComment(postid, commentid);
        var postsArr = this.state.posts;
        for (let p = 0; p < postsArr.length; p++) {//find the post
            if (postsArr[p].id === postid) {
                postsArr[p].comments = comments;
            }
        }
        this.setState({ posts: postsArr });
    }
    postIsDeletable = (poster_id) => {
        if(poster_id == this.state.user_id) return true;
        return false;
    }
    async deleteTrip(post_id){
        await this.apiClient.deleteTrip(post_id);
    }
    deletePost = (post_id) => {
        this.deleteTrip(post_id);
        var postsArr = this.state.posts;
        for(let i = 0; i < postsArr.length; i++){
            let currPost = postsArr[i];
            if(currPost.post_id == post_id){
                postsArr.splice(i, 1);
            }
        }
        this.setState({posts: postsArr});
        this.postModalClose();
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        document.addEventListener("keydown", this.checkEsc, false);
        console.log("Home mounted, user id: " + this.state.user_id);
        this.loadPosts();
    }

    render() {
        return (
            <>
                {this.state.viewOtherProfile && <Redirect to={'/otherprofile/' + this.state.user_id + '/' + this.state.otherProfileId} />}
                <NavBar id={this.state.user_id} />
                <button id="newpostbutton" type="button" onClick={e => this.postFormOpen(e)}>
                    New Post
                </button>
                <Feed posts={this.state.posts} openPost={this.postModalOpen} openProfile={this.openOtherProfile} likePost={this.onClickFeedLikeButton} savePost={this.onClickSaveButton} postIsDeletable={this.postIsDeletable} deletePost={this.deletePost} />
                <div id="bottomspacer" />
                <PostForm show={this.state.postForm} handleClose={e => this.postFormClose(e)}>
                    <div className="pt-4" id="modalcontainer">
                        <h2>Make a Post</h2>
                        <form className="pl-0 pr-3" id="newpostform">
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="origin">Origin of Trip</label>
                                    <input className="form-control" type="text" id="origin"
                                        value={this.state.origin} onChange={e => this.setState({ origin: e.target.value })} required />
                                </div>
                                <div className="col">
                                    <label htmlFor="dest">Destination of Trip</label>
                                    <input className="form-control" type="text" id="dest"
                                        value={this.state.destination} onChange={e => this.setState({ destination: e.target.value })} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="text">Describe your Trip</label>
                                    <textarea className="form-control" id="text" rows="5"
                                        value={this.state.text} onChange={e => this.setState({ text: e.target.value })} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="price">How expensive was it?</label>
                                    <select className="form-control" id="price" value={this.state.price}
                                        onChange={e => this.setState({ price: e.target.value })} required>
                                        <option></option>
                                        {this.prices.map((x, i) => <option key={i}>{x}</option>)}
                                    </select>
                                </div>
                                <div className="col">
                                    <label htmlFor="rating">Rate your Trip</label>
                                    <select className="form-control" id="rating" value={this.state.rating}
                                        onChange={e => this.setState({ rating: e.target.value })} required>
                                        <option></option>
                                        {this.ratings.map((x, i) => <option key={i}>{x}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="imgurl">Add a Photo (URL)</label>
                                    <input className="form-control" type="text" id="imgurl"
                                        value={this.state.imgurl} onChange={e => this.setState({ imgurl: e.target.value })} required />
                                </div>
                                <div className="col">
                                    <label htmlFor="reaction">Reaction to Trip</label>
                                    <select className="form-control" id="reaction" value={this.state.reaction}
                                        onChange={e => this.setState({ reaction: e.target.value })} required>
                                        <option></option>
                                        {this.reactions.map((x, i) => <option key={i}>{x}</option>)}
                                    </select>
                                </div>
                            </div>
                            {!this.readyToPost() &&
                            <button type="button" className="btn btn-secondary" id="postButtonInactive">Post</button>}
                            {this.readyToPost() &&
                            <button type="button" className="btn" id="postButton" onClick={() => this.onPost()}>Post</button>}
                        </form>
                    </div>
                </PostForm>
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
                        <div className="clearfix">
                            <button type="button" className="btn alert-secondary text-danger float-right" id="deletePostButton" onClick={() => this.deletePost(this.state.modalPost.post_id)}>
                                Delete Post
                            </button>
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
                                {this.state.newComment === "" &&
                                    <button type="button" className="btn mt-2 mr-4" id="newCommentButtonInactive">Post Comment</button>
                                }
                                {this.state.newComment !== "" &&
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
export default Home;