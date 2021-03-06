import React from 'react';
import './otherProfile.css';
import NavBar from './NavBar';
import { Link, Redirect } from 'react-router-dom';
import { post_card } from '../models/post_card';
import PostModal from './PostModal';
import CommentList from './CommentList';
import { Rating } from './Rating';
import { Price } from './Price';
import Feed from './Feed';
import { User } from '../models/user';
import {Comment} from '../models/comment';
import {VacationGramAPIClient} from '../Api/VacationGramAPIClient';
import {Reactions} from '../reactions';

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
    dummmyUser1 = new User(35, "", "Dallas", "I'm a professor and I have two dogs!", "", "", "", "https://s2.smu.edu/~mfonten/img/FontenotSM.jpg");

    apiClient = new VacationGramAPIClient();

    constructor(props) {
        super(props)
        this.checkEsc = this.checkEsc.bind(this);
        this.state = {
            curr_user_id: this.props.match.params.curr_id,
            other_user_id: this.props.match.params.other_id,
            username: "",
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
            posts: null,
            nextCommentId: null,
            isSameUser: false
        }
    }

    prices = ["$", "$$", "$$$", "$$$$", "$$$$$"];
    ratings = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];
    // reactions = ["fun", "boring", "exciting", "scary"];
    reactions = Reactions;

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
    async postComment() {
        await this.apiClient.postComment(this.state.modalPost.post_id, this.state.curr_user_id, this.state.newComment).then(comment => {
            this.setState({nextCommentId: comment.info[0].id});
        });
    }
    async onNewComment() {
        await this.postComment();
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mycomment = new Comment(
            this.state.nextCommentId, this.state.modalPost.id, this.state.curr_user_id, this.state.username, 
            null, null, date, this.state.newComment, 0, false
        );
        /* let mycomment = new Comment(
            null, this.state.modalPost.id, this.state.curr
        ); */
        this.state.modalPost.comments.unshift(mycomment);
        this.postModalClose();
        this.postModalOpen(this.state.modalPost);
    }
    scrollToAddComment = () => {
        document.newCommentForm.newCommentTA.focus();
        document.getElementById("newcommenttextarea").scrollIntoView();
    }
    async likeTrip(trip_id) {
        await this.apiClient.likeTrip(trip_id, this.state.curr_user_id);
    }
    async unlikeTrip(trip_id) {
        await this.apiClient.unlikeTrip(trip_id, this.state.curr_user_id);
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
        await this.apiClient.addSavedTrip(this.state.curr_user_id, trip_id);
    }
    async unsaveTrip(trip_id) {
        await this.apiClient.removeSavedTrip(this.state.curr_user_id, trip_id);
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
    async deleteComment(trip_id, comment_id) {
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
    openOtherProfile() {

    }
    postIsDeletable = (poster_id) => {
        if (poster_id == this.state.curr_user_id) return true;
        return false;
    }
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
    async onLikeComment(comment_id) {
        var curr_user_liked = false;
        await this.apiClient.getCommentLikes(this.state.modalPost.post_id, comment_id).then(users => {
            for (let u = 0; u < users.count; u++) {
                let user = users.info[u];
                if (user == this.state.curr_user_id) {
                    curr_user_liked = true;
                }
            }
        });
        if (curr_user_liked == true) {
            await this.apiClient.unlikeComment(this.state.modalPost.post_id, comment_id, this.state.curr_user_id);
        } else if (curr_user_liked == false) {
            await this.apiClient.likeComment(this.state.modalPost.post_id, comment_id, this.state.curr_user_id);
        }
    }
    onLikeCommentButton = (comment_id) => {
        this.onLikeComment(comment_id);
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

    async loadPosts(){
        //get current username
        await this.apiClient.getUserInfo(this.state.curr_user_id).then(user => {
            this.setState({username: user.info[0].name});
        });

        var otherUser;
        //get other user info
        await this.apiClient.getUserInfo(this.state.other_user_id).then(user => {
            otherUser = user.info[0];
        })
        var newOtherUser = new User(
            otherUser.id, otherUser.name, otherUser.email, otherUser.password, otherUser.image_url
        );
        this.setState({user: newOtherUser});

        ///get other user posts
        var postsArr = [];
        var trips;
        await this.apiClient.getUserTrips(this.state.other_user_id).then(tripsReturned => {
            trips = tripsReturned;
        });
        for(let t = 0; t < trips.count; t++){
            var trip = trips.info[t];

            ///get username of poster
            var username;
            await this.apiClient.getUserInfo(trip.user_id).then(user => {
                username = user.info[0].name;
            });

            ///get comments on trip
            var comments;
            var commentsArr = [];
            await this.apiClient.getComments(trip.id).then(commentsReturned => {
                comments = commentsReturned;
            });

            ///get curr_user_liked for trip
            var curr_user_liked;
            await this.apiClient.didUserLikeTrip(trip.id, this.state.curr_user_id).then(resp => {
                curr_user_liked = resp.did_like;
            });

            ///get numlikes for trip
            var numlikes;
            await this.apiClient.getLikes(trip.id).then(likes => {
                numlikes = likes.count;
            });

            ///get curr_user_saved for trip
            var curr_user_saved;
            await this.apiClient.didUserSaveTrip(this.state.curr_user_id, trip.id).then(resp => {
                curr_user_saved = resp.did_save;
            });

            ///Construct comments for trip
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
                            if(this.state.curr_user_id == likes.info[i]) curr_user_liked_comment = true;
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

            ///Construct post
            var post = new post_card(
                trip.id, trip.user_id, username, trip.date_created, trip.origin,
                trip.destination, trip.image_url, trip.body, this.getPrice(trip.price),
                this.getReaction(trip.reaction_id), this.getRating(trip.rating), commentsArr,
                curr_user_liked, numlikes, curr_user_saved
            );
            postsArr.push(post);
        }
        postsArr.sort((a,b) => (a.date < b.date) ? 1 : -1);
        this.setState({posts: postsArr});
    }
    componentDidMount() {
        document.body.style.overflow = "visible";
        window.scrollTo(0,0);
        document.addEventListener("keydown", this.checkEsc, false);
        console.log("Other Profile mounted, curr user: " + this.state.curr_user_id + ", other user: " + this.state.other_user_id);
        if(this.state.curr_user_id === this.state.other_user_id){
            this.setState({ isSameUser: true });
        }
        this.loadPosts();
    }

    render() {
        return <>
        {this.state.isSameUser && <Redirect to={'/profile/' + this.state.curr_user_id}/>}
            <NavBar id={this.state.curr_user_id} />
            <div className="container bootstrap-snippet header-container">
                <div className="bg-white">
                    <div className="container pt-0">
                        <div className="media col-md-10 cold-lg-8 col-xl-7 p-0 mb-4 mx-auto">
                            <img src={this.state.user.profilePicUrl} className="d-block ui-w-100 rounded circle mt-4" id="profImg" />
                        </div>
                        <div className="profUsername">
                            <h4 className="font-weight-bold mb-4">{this.state.user.username}</h4>
                        </div>
                    </div>
                    <hr className="m-0" />
                </div>
            </div>
            <Feed posts={this.state.posts} openPost={this.postModalOpen} openProfile={this.openOtherProfile} likePost={this.onClickFeedLikeButton} savePost={this.onClickSaveButton} postIsDeletable={this.postIsDeletable} deletePost={this.deletePost}/>
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
                    <div className="row text-muted">
                            <p className="col text-right">Reaction: {this.state.modalPost.reaction}</p>
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
                    <CommentList comments={this.state.modalPost.comments} curr_user_id={this.state.curr_user_id} poster_id={this.state.modalPost.user_id} post_id={this.state.modalPost.post_id} handleDeletion={this.onCommentDeletion} onLikeCommentButton={this.onLikeCommentButton}/>
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