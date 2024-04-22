import React, {useState, useContext} from 'react'
import {useLocation} from 'wouter'
import {AppContext} from '../../context/AppContext'
import {RouterNavigatorPropsType, ContextType} from '../../env/types'

const RouterNavigator: React.FC<RouterNavigatorPropsType> = ({url, children}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [_, setLocation] = useLocation()
    const [items] = useState<string[]>(url.split('/profile/'))
    
    const onRedirect = () => {
        let id = Boolean(items.length - 1) ? items[1] : '/'

        if (account.shortid === id) {
            setLocation('/')
        } else {
            setLocation(url)
        }
    }

    return (
        <div onClick={onRedirect} className='navigator'>
            {children}
        </div>
    )
}

export default RouterNavigator