import React, {useState, useLayoutEffect, useMemo} from 'react'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import RouterNavigator from '../../router/RouterNavigator'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import {getProjectsQ} from './gql/queries'
import {PROJECT_DEFAULT_PROGRESS} from './env'
import {WEB_DIRECTIONS, LANGUAGES, SEARCH_PERCENT} from '../../../env/env'

const Projects: React.FC = () => {

    const [filtered, setFiltered] = useState<any[]>([])
    const [projects, setProjects] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(WEB_DIRECTIONS[0])
    const [language, setLanguage] = useState<string>(LANGUAGES[0])
    const [progress, setProgress] = useState<number>(PROJECT_DEFAULT_PROGRESS)

    const {data, loading} = useQuery(getProjectsQ)

    useLayoutEffect(() => {
        changeTitle('Projects')
    
        if (data) {
            setProjects(data.getProjects)
        }

    }, [data])

    useMemo(() => {
        if (projects !== null) {
            let result: any[] = projects.filter(el => el.category === category && el.language === language)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.progress >= progress)
            
            setFiltered(result)
        }
    }, [projects, title, category, language, progress])

    return (
        <div className='main profile'>
            <h2>Найдите интересущий вас проект</h2>
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название...' />

            <div className='items small'>
                {WEB_DIRECTIONS.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <select value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(el => <option value={el}>{el}</option>)}
            </select>

            <h4 className='pale'>Прогресс: <b>{progress}%</b></h4>
            <input value={progress} onChange={e => setProgress(parseInt(e.target.value))} type='range' step={1} />

            <DataPagination items={filtered} setItems={setFiltered} label='Список проектов:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <RouterNavigator url={`/project/${el.shortid}`}>
                                {centum.shorter(el.title, 4)}
                                <p>{el.progress}%</p>
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка проектов' />}
        </div>
    )
}

export default Projects