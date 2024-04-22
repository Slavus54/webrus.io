import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {AppContext} from '../../../context/AppContext'
import {updateProfileInfo} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import FormPagination from '../../../shared/UI/FormPagination'
import {createProjectM} from './gql/mutations'
import {PROJECT_DEFAULT_PROGRESS, PROJECT_AUTHOR_ROLE} from './env'
import {WEB_DIRECTIONS, LANGUAGES} from '../../../env/env'
import {ContextType, CollectionPropsType} from '../../../env/types'

const CreateProject: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    
    const [state, setState] = useState({
        title: '', 
        description: '', 
        category: WEB_DIRECTIONS[0], 
        language: LANGUAGES[0], 
        url: '', 
        idea: '', 
        progress: PROJECT_DEFAULT_PROGRESS, 
        role: PROJECT_AUTHOR_ROLE
    })

    const {title, description, category, language, url, idea, progress, role} = state

    useLayoutEffect(() => {
        changeTitle('New Project')
    }, [])
    
    const [createProject] = useMutation(createProjectM, {
        onCompleted(data) {
            buildNotification(data.createProject)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createProject({
            variables: {
                name: account.name, id, title, description, category, language, url, idea, progress, role
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>    
                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название' type='text' />
                     
                    <textarea value={description} onChange={e => setState({...state, description: e.target.value})} placeholder='Опишите это...' />

                    <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                        {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <div className='items small'>
                        {WEB_DIRECTIONS.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Ссылка на GitHub</h4>
                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                    <h4 className='pale'>Прогресс: <b>{progress}%</b></h4>
                    <input value={progress} onChange={e => setState({...state, progress: parseInt(e.target.value)})} type='range' step={1} />
                </>
            ]}>
                <h2>Новый Проект</h2>
                |
                <button onClick={onCreate}>Создать</button>
            </FormPagination>  
        </>
    )
}

export default CreateProject