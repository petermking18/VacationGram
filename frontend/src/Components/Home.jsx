import React from 'react';
import { Feed } from './Feed';
import { post_card } from '../models/post_card';
import { Comment } from '../models/comment';
import { Redirect, Link } from 'react-router-dom';
import './Home.css';
import NavBar from './navBar';
import PostForm from './PostForm';

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

    constructor(props){
        super(props)
        this.state = {
            id: '',
            postForm: false,
        }
    }

    postFormOpen(){
        this.setState({postForm:true});
    }
    postFormClose(){
        this.setState({postForm:false});
    }

    render() {
        return (
            <>
            <NavBar id={this.props.match.params.id}/>
            <Feed thePosts = {this.posts}></Feed>
            {/* <Link to={'/newpost/' + this.props.match.params.id}>
                <button type="button">New Post</button>
            </Link> */}

            <button id="newpostbutton" type="button" onClick={e => this.postFormOpen(e)}>
                New Post
            </button>
            <PostForm show={this.state.postForm} handleClose={e => this.postFormClose(e)}>
                <h2>Make a Post</h2>

            </PostForm>
            </>
        );
    }
}
export default Home;