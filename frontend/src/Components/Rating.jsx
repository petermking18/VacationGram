import React from 'react';
import './Rating.css';

export const Rating = (props) => (
    <span className="stars ml-3">
        {
            ["1 star","2 stars","3 stars","4 stars","5 stars"].map(x => (<i key={x} className={(x > props.value ? 'empty-star' : 'full-star')}></i>))
        }
    </span>
);
