import Login from './Components/login';
import RegisterPage from './Components/register';
import MainPage  from './Components/mainPage';
import Home from './Components/Home';
import Search from './Components/search';
import personalProfilePage from './Components/personalProfile';
import DrugForm from "./Components/newDrugPage";
import NewPost from "./Components/NewPost";

export const ROUTES = [
    { path: '/search/:id', component: Search},
    { path: '/dashboard/:id', component: MainPage},
    { path: '/home/', component: Home},
    { path: '/newpost', component: NewPost},
    { path: '/profile/:id', component: personalProfilePage},
    { path: '/register', component: RegisterPage},
    { path: '/update/:id/:drugId', component: DrugForm },
    { path: '/', component: Login },
]