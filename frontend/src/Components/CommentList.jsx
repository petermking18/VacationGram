import React from 'react';
import './CommentList.css';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

//export const CommentList = (props) => (
export default class CommentList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            comments: this.props.comments,
        }
    }

    isDeletable(comment){
        ///DO NOT CHANGE TO ===, IDK WHY BUT IT BREAKS THE WHOLE DELETE COMMENT THING
        if(comment.user_id == this.props.curr_user_id) return true;
        if(this.props.curr_user_id == this.props.poster_id) return true;
        return false;
    }
    deleteComment = (commentid) => {
        let cid = commentid;
        var comments = this.state.comments;
        for(let c = 0; c < comments.length; c++){
            if(comments[c].id === commentid){
                comments.splice(c,1);
            }
        }
        this.setState({comments: comments});
        this.setState({numComments: this.state.numComments-1});
        this.props.handleDeletion(this.props.post_id,comments,cid);
    }
    likeCommentButton = (comment) => {
        var comments = this.state.comments;
        var ind = comments.indexOf(comment);
        if(comments[ind].curr_user_liked) comments[ind].numlikes--;
        else if(!comments[ind].curr_user_liked) comments[ind].numlikes++;
        comments[ind].curr_user_liked = !comments[ind].curr_user_liked;
        this.setState({comments: comments});
        this.props.onLikeCommentButton(comment.id);
        /* var commentsArr = this.state.comments;
        for(let c = 0; c < commentsArr.length; c++){
            if(commentsArr[c].id === commentid){
                if(commentsArr[c].curr_user_liked){
                    commentsArr[c].curr_user_liked = false;
                    commentsArr[c].numlikes--;
                }else if(!commentsArr[c].curr_user_liked){
                    commentsArr[c].curr_user_liked = true;
                    commentsArr[c].numlikes++;
                }
            }
        }
        this.setState({comments: commentsArr}); */
    }
    prettyPrintDate(dbDate){
        let date = new Date(dbDate);
        let mydate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        return mydate;
    }
    componentDidMount(){
        this.setState({comments: this.props.comments});

    }
    componentWillReceiveProps(nextProps){
        this.setState({comments: nextProps.comments});
    }
    /* static getDerivedStateFromProps(props, state){
        return props;
    } */
    render() {
        return (
            <>
                <h5 className="container mt-3 pl-0 text-dark">
                    Comments
            <span className="text-secondary"> ({this.state.comments.length})</span>
                </h5>
                <ul className="mt-1 list-unstyled bg-white">
                    <div id="commentListDiv">
                        {this.state.comments.length === 0 && <li className="rounded bg-light border border-secondary-50 px-1 py-2 mt-1">Be the first to comment on this trip!</li>}
                        {this.state.comments.map((comment, index) => (
                            <li className="rounded border border-secondary-50 border-top px-0 mb-3" key={index}>
                                <div className="alert-secondary py-2 border-bottom px-2">
                                    <div className="row">
                                        <div className="col">
                                            {comment.username}
                                        </div>
                                        <div className="col text-right">
                                            {/* {comment.date_created} */}
                                            {this.prettyPrintDate(comment.date_created)}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-1 bg-light border-bottom my-0 px-2">
                                    <p className="mb-1">"{comment.text}"</p>
                                    <div className="row">
                                        <div className="col" id="numlikesoncomment">
                                            <button type="button" onClick={() => this.likeCommentButton(comment)} className="btn alert-secondary px-2 mr-1 mt-0" id="likecomment">
                                                👍
                                                {comment.curr_user_liked && <p>Unlike Comment</p>}
                                                {!comment.curr_user_liked && <p>Like Comment</p>}
                                            </button>
                                            {comment.numlikes !== 1 && <p className="text-muted">({comment.numlikes} likes)</p>}
                                            {comment.numlikes === 1 && <p className="text-muted">({comment.numlikes} like)</p>}
                                        </div>
                                        <div className="col text-right">
                                            {this.isDeletable(comment) &&
                                            <button type="button" onClick={() => this.deleteComment(comment.id)} className="btn alert-secondary text-danger px-2 mr-1 mt-0" id="deletecomment">
                                                Delete comment
                                            </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </div>
                    <div className="">

                    </div>
                </ul>
            </>
        );
    }
}