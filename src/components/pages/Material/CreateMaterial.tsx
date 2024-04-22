import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {updateProfileInfo} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import FormPagination from '../../../shared/UI/FormPagination'
import {createMaterialM} from './gql/mutations'
import {MATERIAL_DEFAULT_RATING, MATEIRAL_ARTICLES_LIMIT} from './env'
import {WEB_DIRECTIONS, LEVELS} from '../../../env/env'
import {ContextType, CollectionPropsType} from '../../../env/types'

const CreateMaterial: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)

    const [article, setArticle] = useState<string>('')
    
    const [state, setState] = useState({
        title: '', 
        category: WEB_DIRECTIONS[0], 
        level: LEVELS[0], 
        articles: [], 
        words: 0, 
        dateUp: datus.timestamp('date'), 
        rating: MATERIAL_DEFAULT_RATING, 
        screen: ''
    })

    const {title, category, level, articles, words, dateUp, rating, screen} = state

    useLayoutEffect(() => {
        changeTitle('New Material')
    }, [])
    
    const [createMaterial] = useMutation(createMaterialM, {
        onCompleted(data) {
            buildNotification(data.createMaterial)
            updateProfileInfo(null)
        }
    })

    const onArticle = () => {
        if (articles.length < MATEIRAL_ARTICLES_LIMIT) {
            let length: number = article.split(' ').length

            setState({...state, articles: [...articles, article], words: words + length})
        }

        setArticle('')
    }

    const onCreate = () => {
        createMaterial({
            variables: {
                name: account.name, id, title, category, level, articles, words, dateUp, rating, screen
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>    
                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название' type='text' />
                     
                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <div className='items small'>
                        {WEB_DIRECTIONS.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div>

                    <h2>Абзацы {articles.length}/{MATEIRAL_ARTICLES_LIMIT}</h2>

                    <textarea value={article} onChange={e => setArticle(e.target.value)} placeholder='Текст...' />

                    <h4 className='pale'>Всего слов: <b>{words}</b></h4>

                    <button onClick={onArticle}>Добавить</button>
                </>
            ]}>
                <h2>Новый Материал</h2>
                |
                <button onClick={onCreate}>Создать</button>
            </FormPagination>  
        </>
    )
}

export default CreateMaterial