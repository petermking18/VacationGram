import Login from './Components/login';
import RegisterPage from './Components/register';
import MainPage  from './Components/mainPage';
import Home from './Components/Home';
import Search from './Components/search';
import ProfilePage from './Components/profilePage';
import DrugForm from "./Components/newDrugPage";
import NewPost from "./Components/NewPost";

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: '/dashboard/:id', component: MainPage },
    { path: '/home/', component: Home},
    { path: '/profile/:id', component: ProfilePage},
    { path: '/register', component: RegisterPage },
    { path: '/update/:id/:drugId', component: DrugForm },
    { path: '/', component: Login },
    { path: '/newpost', component: NewPost}
]