import React from 'react';
import ReactDom from 'react-dom';

const PostForm = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal d-block" : "modal d-none";

    return (
        <div className={showHideClassName}>
            <div id="backdiv"></div>
            <div id="postformdiv">
                {children}
                <a href="javascript:;" className="modal-close" onClick={handleClose}>
                    close
                    </a>
            </div>
        </div>
    );
};
export default PostForm;