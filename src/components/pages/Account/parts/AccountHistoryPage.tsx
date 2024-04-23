import React, {useState} from 'react'
import {centum} from '../../../../shared/libs/libs'
import {initPages} from '../../../../utils/storage'
import RouterNavigator from '../../../router/RouterNavigator'
import DataPagination from '../../../../shared/UI/DataPagination'
import {AccountPropsType, HistoryPageType} from '../../../../env/types'

const AccountHistoryPage: React.FC<AccountPropsType> = ({profile}) => {   
    const [pages] = useState<HistoryPageType[]>(initPages())
    const [filtered, setFiltered] = useState<HistoryPageType[]>([])

    return (
        <div className='main profile'>
            <h2>История посещенных страниц</h2>
            <h4 className='pale'>Можете вернуться к компонентам в любой момент</h4>
            
            <DataPagination items={pages} setItems={setFiltered} label='Список:' />
            <div className='items half'>
                {filtered.map(el => 
                    <div className='item panel'>
                        <RouterNavigator url={el.url}>
                            {centum.shorter(el.title, 4)}
                            <p className='pale'>{el.type}</p>
                        </RouterNavigator>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccountHistoryPage