import Login from './Components/login';
import RegisterPage from './Components/register';
import MainPage  from './Components/mainPage';
import Home from './Components/Home';
import Search from './Components/search';
import PersonalProfilePage from './Components/personalProfile';
import OtherProfilePage from './Components/otherProfile';
import PrivateSaved from './Components/privateSaved';

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: 'personalProfile/:id', component: PersonalProfilePage},
    { path: '/otherProfile/:id', component: OtherProfilePage},
    { path: '/home/', component: Home},
    { path: '/privateSaved/:id', component: PrivateSaved},
    { path: '/register', component: RegisterPage },
    { path: '/login/:id', component: Login }
]