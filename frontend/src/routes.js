import Login from './Components/login';
import RegisterPage from './Components/register';
import MainPage  from './Components/mainPage';
import Search from './Components/search';
import PersonalProfilePage from './Components/personalProfile';
import OtherProfilePage from './Components/otherProfile';
import DrugForm from "./Components/newDrugPage";

export const ROUTES = [
    { path: '/search/:id', component: Search },
    { path: '/dashboard/:id', component: MainPage },
    { path: '/personalprofile/:id', component: PersonalProfilePage},
    { path: '/otherprofile/:id', component: OtherProfilePage},
    { path: '/register', component: RegisterPage },
    { path: '/', component: Login }
]