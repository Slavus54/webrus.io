// Home
import Home from '../components/head/Home'

// Authentication

import Register from '../components/pages/Authentication/Register'
import Login from '../components/pages/Authentication/Login'

// Material's Components

import CreateMaterial from '../components/pages/Material/CreateMaterial'
import Materials from '../components/pages/Material/Materials'
import Material from '../components/pages/Material/Material'

// Project's Components

import CreateProject from '../components/pages/Project/CreateProject'
import Projects from '../components/pages/Project/Projects'
import Project from '../components/pages/Project/Project'

// Vacancy's Components

import CreateVacancy from '../components/pages/Vacancy/CreateVacancy'
import Vacancies from '../components/pages/Vacancy/Vacancies'
import Vacancy from '../components/pages/Vacancy/Vacancy'

// Assembly's Components

import CreateAssembly from '../components/pages/Assembly/CreateAssembly'
import Assemblies from '../components/pages/Assembly/Assemblies'
import Assembly from '../components/pages/Assembly/Assembly'

// Profile's Components

import Profiles from '../components/pages/Profile/Profiles'
import Profile from '../components/pages/Profile/Profile'

import {RouteItem, RouteStatuses} from './types'

export const items: RouteItem[] = [
    {
        title: 'Главная',
        url: '/',
        component: Home,
        status: RouteStatuses.Allowed,
        visible: true
    },
    {
        title: 'Материалы',
        url: '/materials',
        component: Materials,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Проекты',
        url: '/projects',
        component: Projects,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Вакансии',
        url: '/vacancies',
        component: Vacancies,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Ассамблеи',
        url: '/assemblies',
        component: Assemblies,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Пользователи',
        url: '/profiles',
        component: Profiles,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: '',
        url: '/register',
        component: Register,
        status: RouteStatuses.StrangerOnly,
        visible: false
    },
    {
        title: '',
        url: '/login',
        component: Login,
        status: RouteStatuses.StrangerOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-material/:id',
        component: CreateMaterial,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/material/:id',
        component: Material,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-project/:id',
        component: CreateProject,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/project/:id',
        component: Project,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-vacancy/:id',
        component: CreateVacancy,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/vacancy/:id',
        component: Vacancy,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-assembly/:id',
        component: CreateAssembly,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/assembly/:id',
        component: Assembly,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/profile/:id',
        component: Profile,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
]