import Vue from "vue"
import VueRouter from "vue-router"
import ContactInfo from "./views/ContactInfo"
import AppInfo from "./views/AppInfo"
import LearningCourse from "./views/LearningCourse"
import LoginScreen from '../components/LoginScreen'

import FormCourseNew from './views/FormCourseNew'
import FormCourseEdit from './views/FormCourseEdit'
import FormTestNew from './views/FormTestNew'
import FormTestEdit from './views/FormTestEdit'
import FormAccCheck from './views/FormAccCheck'

import DesktopLoadTests from "./views/DesktopLoadTests"
import UseTest from './views/UseTest'
import TestRecord from './views/TestRecord'
import TestRecordsList from './views/TestRecordsList'


import ShowCourse from './views/ShowCourse'

import NotHavePerms from './views/errors/NotHavePerms'
import NotFound from './views/errors/NotFound'

import { tokenManager } from "../main";
import { userManager } from "../main";


Vue.use(VueRouter)

const routes = [

    { path: "/prihlaseni", component: LoginScreen, name: "login"},
    { path: "/kontakty", component: ContactInfo, name: "contacts", meta: { requireAuth: true }},
    { path: "/", component: AppInfo, name: "application", meta: { requireAuth: true }},
    
    { path: "/testy", component: DesktopLoadTests, name: "test", props: true, meta: { requireAuth: true }},
    { path: "/test/novy", component: FormTestNew, name: "newTest", meta: { requireAuth: true }},
    { path: "/test/vypracovat/:id_test", component: UseTest, name: "useTest", meta: { requireAuth: true }},
    { path: "/test/upravit", component: FormTestEdit, name: "editTest", props: true, meta: { requireAuth: true }},
    { path: "/testy/vysledky", component: TestRecordsList, name: "testRecords", props: true, meta: { requireAuth: true }},
    { path: "/test/vysledek/:id_record", component: TestRecord, name: "testRecord", meta: { requireAuth: true }},
   


    { path: "/sprava/ucty", component: FormAccCheck, name: "checkParents", meta: { requireAuth: true }},


    { path: "/chyba/prava", component: NotHavePerms, name: "errNotPerms"},

    /* --- kurz --- */
    { path: "/vyuka", component: LearningCourse, name: "course", meta: { requireAuth: true }, props: true},
    { path: "/vyuka/kurz/:id_course", component: ShowCourse, name: "courseById", props: true, meta: { requireAuth: true }},
    { path: "/vyuka/novy/kurz", component: FormCourseNew, name: "newCourse", meta: { requireAuth: true }},
    { path: "/vyuka/upravit/kurz", component: FormCourseEdit, name: "editCourse", meta: { requireAuth: true }},

    { path: "*", component: NotFound, name: "notFound"},

    /*
    { path: "/register", component: Register, name: "register"},
    { path: "/contacts", component: Contacts, name: "contacts"},
    { path: "/profile", component: Profile, name: "profile"},
    { path: "/profile/edit", component: ModifyProfile, name: "profileEdit"},
    { path: "/info", component: Info, name: "info"},
    { path: "", component: Home, name: "home"},
    { path: "/rooms", component: Rooms, name: "rooms", meta: { requireAuth: true }},
    { path: "/room/:id", component: Room, name: "room", meta: { requireAuth: true }},
    { path: "/room/new", component: NewRoom, name: "newRoom", meta: { requireAuth: true }},
    { path: "*", component: NotFound, name: "notFound"},
    */
];

const router = new VueRouter( {routes: routes, mode: "history"} );

router.beforeEach((to, from, next) => {
    if(to.meta != null && to.meta.requireAuth){
        //kontrola, jestli mam token
        if(tokenManager.isUserLogged()){
            next();
        } else {
            tokenManager.removeToken();
            userManager.removeEmail();
            next({ name: "login" });
        } 
    } else {
        next();
    }
});


export default router;

