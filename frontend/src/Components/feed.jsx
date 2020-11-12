//use for our project
import React from 'react';
import { post_card } from '../models/post_card';
import './Feed.css'

//props will be array of post_cards
export const Feed = (props) => (
    <>
        <ul>
            {props.thePosts.map((post, index) => (
                <li class="postcard">
                    <h4>{post.username}</h4>
                    <h5>{post.date}</h5>
                    <h5>{post.location}</h5>
                    <img src={post.imgurl}></img>
                    <p>{post.text}</p>
                    {post.comments.length === 1 && (<p>1 comment</p>)}
                    {post.comments.length != 1 && (<p>{post.comments.length} comments</p>)}
                    <button type="button">Like</button>
                    <button type="button">Comment</button>
                </li>
            ))}
        </ul>
    </>
);