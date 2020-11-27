import Login from './Components/login';
import RegisterPage from './Components/register';
import Home from './Components/Home';
import Search from './Components/search';
import PersonalProfile from './Components/personalProfile';
import NewPost from './Components/NewPost';
import ProfilePage from './Components/profilePage';
import OtherProfile from './Components/otherProfile';

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: '/home/:id', component: Home },
    { path: '/profile/:id', component: PersonalProfile },
    { path: '/otherprofile/:curr_id/:other_id', component: OtherProfile},
    { path: '/register', component: RegisterPage },
    { path: '/settings/:id', component: ProfilePage },
    { path: '/', component: Login },
]