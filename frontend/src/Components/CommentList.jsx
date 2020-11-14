import React from 'react';
import './CommentList.css';

export const CommentList = (props) => (
    <>
        <h5 className="container mt-3 pl-0 text-dark">
            Comments
            <span className="text-secondary"> ({props.comments.length})</span>
        </h5>
        <ul className="mt-1 list-unstyled bg-white">
            <div id="commentListDiv">
                {props.comments.length === 0 && <li className="rounded bg-light border border-secondary-50 px-1 py-2 mt-1">Be the first to comment on this trip!</li>}
                {props.comments.map((comment, index) => (
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
                        <div className="py-2 bg-light border-bottom px-2">
                            <p>"{comment.text}"</p>
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn alert-secondary px-2 mr-1" id="likecomment">
                                        👍 Like Comment
                                </button>
                                    <t className="text-muted">({comment.numlikes} likes)</t>
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