import React, {useState, useLayoutEffect, useMemo} from 'react'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import RouterNavigator from '../../router/RouterNavigator'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import {getMaterialsQ} from './gql/queries'
import {WEB_DIRECTIONS, LEVELS, SEARCH_PERCENT} from '../../../env/env'

const Materials: React.FC = () => {

    const [filtered, setFiltered] = useState<any[]>([])
    const [materials, setMaterials] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(WEB_DIRECTIONS[0])
    const [level, setLevel] = useState<string>(LEVELS[0])

    const {data, loading} = useQuery(getMaterialsQ)

    useLayoutEffect(() => {
        changeTitle('Materials')
    
        if (data) {
            setMaterials(data.getMaterials)
        }

    }, [data])

    useMemo(() => {
        if (materials !== null) {
            let result: any[] = materials.filter(el => el.category === category)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.level === level)
            
            setFiltered(result)
        }
    }, [materials, title, category, level])

    return (
        <div className='main profile'>
            <h2>Поиск нужного материала</h2>
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название...' />

            <div className='items small'>
                {WEB_DIRECTIONS.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <select value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} label='Список материлов:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <RouterNavigator url={`/material/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка материалов' />}
        </div>
    )
}

export default Materials