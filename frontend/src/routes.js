import Login from './Components/login';
import RegisterPage from './Components/register';
import Home from './Components/Home';
import Search from './Components/search';
import PersonalProfile from './Components/personalProfile';
import NewPost from "./Components/NewPost";
import ProfilePage from "./Components/profilePage"

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: '/home/', component: Home },
    { path: '/newpost', component: NewPost },
    { path: '/profile/:id', component: PersonalProfile },
    { path: '/register', component: RegisterPage },
    { path: '/settings', component: ProfilePage },
    { path: '/', component: Login },
]