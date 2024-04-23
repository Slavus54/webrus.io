import AccountPersonalPage from '../components/pages/Account/parts/AccountPersonalPage'
import AccountGeoPage from '../components/pages/Account/parts/AccountGeoPage'
import AccountSecurityPage from '../components/pages/Account/parts/AccountSecurityPage'
import AccountAchievementsPage from '../components/pages/Account/parts/AccountAchievementsPage'
import AccountCareersPage from '../components/pages/Account/parts/AccountCareersPage'
import AccountCollectionsPage from '../components/pages/Account/parts/AccountCollectionsPage'
import AccountHistoryPage from '../components/pages/Account/parts/AccountHistoryPage'

import {AccountPart} from './types'

export const parts: AccountPart[] = [
    {
        title: 'Профиль',
        url: './profile/account.png',
        component: AccountPersonalPage
    },
    {
        title: 'Локация',
        url: './profile/geo.png',
        component: AccountGeoPage
    },
    {
        title: 'Безопасность',
        url: './profile/security.png',
        component: AccountSecurityPage
    },
    {
        title: 'Портфолио',
        url: './profile/achievements.png',
        component: AccountAchievementsPage
    },
    {
        title: 'Карьера',
        url: './profile/careers.png',
        component: AccountCareersPage
    },
    {
        title: 'Компоненты',
        url: './profile/collections.png',
        component: AccountCollectionsPage
    },
    {
        title: 'История',
        url: './profile/history.png',
        component: AccountHistoryPage
    }
]