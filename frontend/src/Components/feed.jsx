import React from 'react';
import { post_card } from '../models/post_card';
import './Feed.css'
import PostCard from './PostCard';
import { Redirect, Link } from 'react-router-dom';

export const Feed = (props) => (
    <>
        <ul class="feed" className="mt-1 bg-light list-unstyled bg-white" id="homefeed">
            {props.thePosts.map((post, index) => (
                <PostCard thePost={post} postModalOpen={props.postModalOpen}></PostCard>
            ))}
        </ul>
    </>
);