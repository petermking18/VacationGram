//use for our project
import React from 'react';
import { post_card } from '../models/post_card';
import './Feed.css'
import PostCard from './PostCard';

//props will be array of post_cards
export const Feed = (props) => (
    <>
        <ul class="feed" className="mt-1 bg-light list-unstyled bg-white" id="homefeed">
            {props.thePosts.map((post, index) => (
                <PostCard thePost={post}></PostCard>
            ))}
        </ul>
    </>
);