import Login from './Components/login';
import RegisterPage from './Components/register';
import MainPage  from './Components/mainPage';
import Home from './Components/Home';
import Search from './Components/search';
import PrivateSaved from './Components/privateSaved';
import NewPost from "./Components/NewPost";

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: '/dashboard/:id', component: MainPage},
    { path: '/home/', component: Home},
    { path: '/newpost', component: NewPost},
    { path: '/privateSaved/:id', component: PrivateSaved},
    { path: '/register', component: RegisterPage },
    { path: '/', component: Login },
]