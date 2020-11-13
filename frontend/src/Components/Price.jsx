import React from 'react';
import './Price.css';

export const Price = (props) => (
    <span className="price ml-3">
        {
            ["$","$$","$$$","$$$$","$$$$$"].map(x => (<i key={x} className={(x > props.value ? 'empty-dollar' : 'full-dollar')}></i>))
        }
    </span>
);