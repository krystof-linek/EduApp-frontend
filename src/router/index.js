import Vue from "vue"
import VueRouter from "vue-router"
import ContactInfo from "./views/ContactInfo"
import AppInfo from "./views/AppInfo"
import LearningCourse from "./views/study/LearningCourse"
import LoginScreen from '../components/LoginScreen'
import HelloWorld from '../components/HelloWorld'
import LogoutPage from './views/LogoutPage'

import FormCourseNew from './views/teacher/FormCourseNew'
import FormCourseEdit from './views/FormCourseEdit'
import FormTestNew from './views/teacher/FormTestNew'
import FormTestEdit from './views/teacher/FormTestEdit'
import FormAccCheck from './views/teacher/FormAccCheck'

import DesktopLoadTests from "./views/DesktopLoadTests"
import UseTest from './views/UseTest'
import TestRecord from './views/TestRecord'


import ShowCourse from './views/ShowCourse'

import NotHavePerms from './views/errors/NotHavePerms'

import { tokenManager } from "../main";


Vue.use(VueRouter)

const routes = [

    { path: "/hello", component: HelloWorld, name: "hello", meta: { requireAuth: true }},

    { path: "/login", component: LoginScreen, name: "login"},
    { path: "/logout", component: LogoutPage, name: "logout"},
    { path: "/kontakty", component: ContactInfo, name: "contacts", meta: { requireAuth: true }},
    { path: "/aplikace", component: AppInfo, name: "application", meta: { requireAuth: true }},
    
    { path: "/testy", component: DesktopLoadTests, name: "test", meta: { requireAuth: true }},
    { path: "/novy/test", component: FormTestNew, name: "newTest", meta: { requireAuth: true }},
    { path: "/upravit/test", component: FormTestEdit, name: "editTest", props: true, meta: { requireAuth: true }},
    { path: "/ucty/schvalit", component: FormAccCheck, name: "checkParents", meta: { requireAuth: true }},

    { path: "/test/:id_test", component: UseTest, name: "useTest", meta: { requireAuth: true }},

    { path: "/vysledek/test/:id_record", component: TestRecord, name: "testRecord", meta: { requireAuth: true }},

    { path: "/chyba/prava", component: NotHavePerms, name: "errNotPerms"},

    /* --- kurz --- */
    { path: "/vyuka", component: LearningCourse, name: "course", meta: { requireAuth: true }, props: true},
    { path: "/vyuka/kurz/:id_course", component: ShowCourse, name: "courseById", props: true, meta: { requireAuth: true }},
    { path: "/vyuka/novy/kurz", component: FormCourseNew, name: "newCourse", meta: { requireAuth: true }},
    { path: "/vyuka/upravit/kurz", component: FormCourseEdit, name: "editCourse", meta: { requireAuth: true }},

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
            next({ name: "logout" });
        } 
    } else {
        next();
    }
});


export default router;

