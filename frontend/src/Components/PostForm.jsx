import React from 'react';
import './PostForm.css'

const PostForm = ({ handleClose, show, children}) => {
    const showHideClassName = show ? "modal d-block" : "modal d-none";

    return (
        <div className={showHideClassName}>
            <div id="backdiv" onClick={handleClose}></div>
            <div id="postformdiv">
                <button type="button" /*href="javascript:;"*/ className="float-right mr-2" onClick={handleClose} id="closeModalButton">
                ×
                </button>
                {children}
            </div>
        </div>
    );
};
export default PostForm;