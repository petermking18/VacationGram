import React from 'react';
import { Rating } from './Rating';
import { Price } from './Price';
import './PostModal.css';

const PostModal = ({handleClose, show, children}) => {
    const showHideClassName = show ? "modal d-block" : "modal d-none";

    return (
        <div className={showHideClassName}>
            <div id="backdiv" onClick={handleClose}></div>
            <div id="postmodaldiv">
                <button type="button" href="javascript:;" className="float-right mr-2" onClick={handleClose} id="closeModalButton">
                ×
                </button>
                {children}
            </div>
        </div>
    );
}
export default PostModal;