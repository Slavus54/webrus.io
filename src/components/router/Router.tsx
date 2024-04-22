import React, {useState, useContext, useMemo} from 'react'
import {Link, Route} from 'wouter'
import {AppContext} from '../../context/AppContext'
import {items} from '../../env/routes'
import {ContextType, RouteItem, RouteStatuses} from '../../env/types'

const Router: React.FC = () => {
    const {account} = useContext<ContextType>(AppContext)
    const [routes, setRoutes] = useState<RouteItem[]>(items)
    const [pages, setPages] = useState<RouteItem[]>(items)

    useMemo(() => {    
        let filteredPages = items.filter(el => account.shortid === '' ? el.status < RouteStatuses.RegisteredOnly : el.status > RouteStatuses.StrangerOnly)
        let filteredRoutes = filteredPages.filter(el => el.visible) 
     
        setRoutes(filteredRoutes)
        setPages(filteredPages)
    }, [account])

    return (
        <>
            <div className='navbar'>
                {routes.map((el, idx) => 
                    <Link href={el.url} key={idx} className='navbar__item'>{el.title}</Link>
                )}
            </div>
            
            {pages.map((el, idx) => <Route component={el.component} path={el.url} key={idx} />)}
        </>
    )
}

export default Router