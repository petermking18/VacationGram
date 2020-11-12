import React from 'react';
import { Feed } from './Feed';
import { post_card } from '../models/post_card';
import { Comment } from '../models/comment';
import { Redirect, Link } from 'react-router-dom';
import './Home.css';
import NavBar from './navBar';

export class Home extends React.Component {
    dummyPost1 = new post_card (1, "Mark Fontenot", "Nov 9 2020",
     "Hawaii", "https://www.smu.edu/-/media/Images/News/Experts/Mark-Fontenot.jpg?la=en",
     "Today, I went snorkeling and then I went hiking and then I built a sand castle and then I ............................... ........................................................................................................................",
     [] );
     dummyComment1 = new Comment (1, 1, 1, 1, false, "Nov 11 2020");
     dummyPost2 = new post_card (2, "Peter King", "Nov 10 2020",
     "Washington, DC", "https://dcist.com/wp-content/uploads/sites/3/2020/07/washington-monument-5266903_1920-1500x1000.jpg", 
     "I walked around the National Mall and saw some cool buildings!",
     [this.dummyComment1] );
    
    posts = [this.dummyPost1,this.dummyPost2];
    
    state = (
        []
    );

    onNewPost(/* post info */){
        
    }

    render() {
        return (
            <>
            <NavBar/>
            <Feed thePosts = {this.posts}></Feed>
            <Link to={'newpost'}>
                <button type="button">New Post</button>
            </Link>
            </>
        );
    }
}
export default Home;