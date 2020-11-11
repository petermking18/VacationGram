import Login from './Components/login';
import RegisterPage from './Components/register';
import MainPage  from './Components/mainPage';
import Search from './Components/search';
import PersonalProfilePage from './Components/personalProfile';
import OtherProfilePage from './Components/otherProfile';

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: '/dashboard/:id', component: MainPage },
    { path: '/', component: PersonalProfilePage},
    { path: '/otherprofile/:id', component: OtherProfilePage},
    { path: '/register', component: RegisterPage },
    { path: '/login/:id', component: Login }
]