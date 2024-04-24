import React, {useState, useContext, useLayoutEffect, useEffect, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updatePages} from '../../../utils/storage'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import {getMaterialM, manageMaterialResourceM, updateMaterialRatingM, updateMaterialScreenM, publishMaterialQuestionM} from './gql/mutations'
import {RESOURCE_TYPES} from './env'
import {LANGUAGES, LEVELS} from '../../../env/env'
import {ContextType, CollectionPropsType} from '../../../env/types'

const Material: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)

    const [resources, setResources] = useState<any[]>([])
    const [resource, setResource] = useState<any | null>(null)
    const [question, setQuestion] = useState<any | null>(null)
    const [material, setMaterial] = useState<any | null>(null)

    const [screen, setScreen] = useState<string>('')
    const [points, setPoints] = useState<number>(0)
    const [rating, setRating] = useState<number>(0)
    
    const [state, setState] = useState({
        title: '',
        category: RESOURCE_TYPES[0],
        language: LANGUAGES[0],
        url: '',
        text: '',
        level: LEVELS[0],
        answer: '',
        dateUp: datus.timestamp('date')
    })

    const {title, category, language, url, text, level, answer, dateUp} = state

    const [getMaterial] = useMutation(getMaterialM, {
        onCompleted(data) {
            setMaterial(data.getMaterial)
        }
    })

    const [manageMaterialResource] = useMutation(manageMaterialResourceM, {
        onCompleted(data) {
            buildNotification(data.manageMaterialResource, 'Material')
        }
    })

    const [updateMaterialRating] = useMutation(updateMaterialRatingM, {
        onCompleted(data) {
            buildNotification(data.updateMaterialRating, 'Material')
        }
    })

    const [updateMaterialScreen] = useMutation(updateMaterialScreenM, {
        onCompleted(data) {
            buildNotification(data.updateMaterialScreen, 'Material')
        }
    })
    
    const [publishMaterialQuestion] = useMutation(publishMaterialQuestionM, {
        onCompleted(data) {
            buildNotification(data.publishMaterialQuestion, 'Material')
        }
    })

    useLayoutEffect(() => {
        changeTitle('Material')
    
        if (account.shortid !== '') {
            getMaterial({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useEffect(() => {
        if (material !== null) {
            setRating(material.rating)
            setScreen(material.screen)
            
            updatePages(material.title, 'material', window.location.pathname, datus.timestamp())
        }
    }, [material])

    useMemo(() => {
        setState({...state, answer: ''})
    }, [question])

    const onView = () => {
        centum.go(resource.url)
    }

    const onQuestion = () => {
        if (question === null) {
            let result = centum.random(material.questions)?.value

            if (result !== undefined) {
                setQuestion(result)
            }
        } else {

            if (question.answer === answer) {
                let award: number = LEVELS.indexOf(question.level)

                setPoints(points + award)
            }

            setQuestion(null)
        }
    } 

    const onManageResource = (option: string) => {
        manageMaterialResource({
            variables: {
                name: account.name, id, option, title, category, language, url, likes: Number(resource !== null), coll_id: resource !== null ? '' : 0
            }
        })
    }

    const onUpdateRating = () => {
        updateMaterialRating({
            variables: {
                name: account.name, id, rating
            }
        })
    }

    const onUpdateScreen = () => {
        updateMaterialScreen({
            variables: {
                name: account.name, id, screen
            }
        })
    }

    const onPublishQuestion = () => {
        publishMaterialQuestion({
            variables: {
                name: account.name, id, text, level, answer, dateUp 
            }
        })
    }

    return (
        <div className='main profile'>
            {material !== null &&
                <>
                    <h2>{material.title}</h2>

                    {screen !== '' && <ImageLook src={screen} className='photo' alt='code photo' />}

                    <div className='items small'>
                        <h4 className='pale'>Тема: {material.category}</h4>
                        <h4 className='pale'><b>{material.words}</b> слов</h4>
                    </div>

                    {resource === null ?
                            <>
                                <h2>Новый Ресурс</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название...' />

                                <h4 className='pale'>Тип</h4>
                                <div className='items small'>
                                    {RESOURCE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                                <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                                    {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <button onClick={() => onManageResource('create')}>Создать</button>

                                <DataPagination items={material.resources} setItems={setResources} label='Список ресурсов:' />
                                <div className='items half'>
                                    {resources.map(el => 
                                        <div onClick={() => setResource(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setResource(null)} />
                                
                                <h2>{resource.title}</h2>

                                <button onClick={onView} className='light'>Смотреть</button>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {resource.category}</h4>
                                    <h4 className='pale'>Язык {resource.language}</h4>
                                </div>

                                <p><b>{resource.likes}</b> лайков</p>

                                {account.name === resource.name ?   
                                        <button onClick={() => onManageResource('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageResource('like')}>Нравится</button>
                                }
                            </>
                    }

                    <h4 className='pale'>Рейтинг материала: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />
                    <button onClick={onUpdateRating}>Обновить</button>

                    <h4 className='pale'>Поделитесь вашим кодом по теме материала</h4>
                    <ImageLoader setImage={setScreen} />
                    <button onClick={onUpdateScreen}>Загрузить</button>

                    {question === null ?
                            <>
                                <h2>Новый вопрос о материале</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Формулировка...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <input value={answer} onChange={e => setState({...state, answer: e.target.value})} placeholder='Ответ' type='text' />

                                <button onClick={onPublishQuestion}>Опубликовать</button>

                                <h4 className='pale'>Баллы: <b>{points}</b></h4>

                                <button onClick={onQuestion} className='light'>Сгенерировать</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>{question.text}</h2>

                                <h4 className='pale'>Сложность: {question.level}</h4>

                                <input value={answer} onChange={e => setState({...state, answer: e.target.value})} placeholder='Ответ' type='text' />

                                <button onClick={onQuestion} className='light'>Ответить</button>
                            </>
                    }
                </>
            }

            {material == null && <Loading label='Материал загружается' />}
        </div>
    )
}

export default Material