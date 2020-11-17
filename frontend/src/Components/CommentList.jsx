import React from 'react';
import './CommentList.css';

//export const CommentList = (props) => (
export default class CommentList extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    isDeletable(comment){
        return (comment.user_id === this.props.curr_user_id) || (this.props.curr_user_id === this.props.poster_id);
    }
    deleteComment(comment){
        //
    }

    render() {
        return (
            <>
                <h5 className="container mt-3 pl-0 text-dark">
                    Comments
            <span className="text-secondary"> ({this.props.comments.length})</span>
                </h5>
                <ul className="mt-1 list-unstyled bg-white">
                    <div id="commentListDiv">
                        {this.props.comments.length === 0 && <li className="rounded bg-light border border-secondary-50 px-1 py-2 mt-1">Be the first to comment on this trip!</li>}
                        {this.props.comments.map((comment, index) => (
                            <li className="rounded border border-secondary-50 border-top px-0 mb-3" key={index}>
                                <div className="alert-secondary py-2 border-bottom px-2">
                                    <div className="row">
                                        <div className="col">
                                            {comment.username}
                                        </div>
                                        <div className="col text-right">
                                            {comment.date_created}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-1 bg-light border-bottom my-0 px-2">
                                    <p className="mb-1">"{comment.text}"</p>
                                    <div className="row">
                                        <div className="col">
                                            <button type="button" className="btn alert-secondary px-2 mr-1 mt-0" id="likecomment">
                                                👍
                                            </button>
                                            <t className="text-muted">({comment.numlikes} likes)</t>
                                        </div>
                                        <div className="col text-right">
                                            {this.isDeletable(comment) &&
                                            <button type="button" className="btn alert-secondary text-danger px-2 mr-1 mt-0" id="deletecomment">
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