import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {AppContext} from '../../../context/AppContext'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import {updatePages} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import MapPicker from '../../../shared/UI/MapPicker'
import Loading from '../../../shared/UI/Loading'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import DataPagination from '../../../shared/UI/DataPagination'
import {getSchoolM, publishSchoolFactM, updateSchoolInformationM, manageSchoolPersonM} from './gql/mutations'
import {SUBJECTS, PERSON_TYPES, STATUSES} from './env'
import {LEVELS, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {MapType, CollectionPropsType, ContextType, Cords} from '../../../env/types'

const School: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext) 
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [school, setSchool] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)
    const [persons, setPersons] = useState<any[]>([])
    const [person, setPerson] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [points, setPoints] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        level: LEVELS[0],
        isTrue: true,
        dateUp: datus.timestamp('date'),
        subject: '',
        rating: 0,
        title: '',
        category: PERSON_TYPES[0],
        status: STATUSES[0]
    })
    
    const {text, level, isTrue, dateUp, subject, rating, title, category, status} = state

    const [getSchool] = useMutation(getSchoolM, {
        onCompleted(data) {
            setSchool(data.getSchool)
        }
    })

    const [publishSchoolFact] = useMutation(publishSchoolFactM, {
        onCompleted(data) {
            buildNotification(data.publishSchoolFact)
        }
    })

    const [updateSchoolInformation] = useMutation(updateSchoolInformationM, {
        onCompleted(data) {
            buildNotification(data.updateSchoolInformation)
        }
    })

    const [manageSchoolPerson] = useMutation(manageSchoolPersonM, {
        onCompleted(data) {
            buildNotification(data.manageSchoolPerson)
        }
    })

    useLayoutEffect(() => {
        changeTitle('School')
    
        if (account.shortid !== '') {
            getSchool({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useMemo(() => {
        if (school !== null) {
            setState({...state, subject: school.subject, rating: school.rating})

            setCords(school.cords)
            setImage(school.image)
            updatePages(school.title, 'school', window.location.pathname, datus.timestamp())
        }
    }, [school])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        setState({...state, isTrue: true})
    }, [fact])

    const onFact = () => {
        if (fact === null) {
            let result = centum.random(school.facts)?.value

            if (result !== undefined) {
                setFact(result)
            }
        } else {
            let award: number = LEVELS.indexOf(fact.level) + 1

            if (fact.isTrue === isTrue) {
                setPoints(points + award)
            }

            setFact(null)
        }
    }

    const onPublishFact = () => {
        publishSchoolFact({
            variables: {
                name: account.name, id, text, level, isTrue, dateUp
            }
        })
    }

    const onUpdateInformation = () => {
        updateSchoolInformation({
            variables: {
                name: account.name, id, subject, rating, image
            }
        })
    }

    const onManagePerson = (option: string) => {
        manageSchoolPerson({
            variables: {
                name: account.name, id, option, title, category, status, likes: Number(person !== null), coll_id: person === null ? '' : person.shortid
            }
        })
    }

    return (
        <div className='main profile'>
            {school !== null &&
                <>
                    <h2>{school.title}</h2>
                    <p>Выпускник сдал ЕГЭ по предмету "{school.subject}" на {school.rating} быллов</p>

                    {image !== '' && <ImageLook src={image} className='photo' alt='school photo' />}

                    <div className='items small'>
                        <h4 className='pale'>Тип: {school.category}</h4>
                        <h4 className='pale'>Город: {school.region}</h4>
                    </div>                    

                    {person === null ?
                            <>
                                <h2>Новая Персона</h2>
                                <h4 className='pale'>Цифровой след сотрудника учебного заведения</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Полное имя...' />

                                <div className='items small'>
                                    {PERSON_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                    {STATUSES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <button onClick={() => onManagePerson('create')}>Создать</button>

                                <DataPagination items={school.persons} setItems={setPersons} label='Список сотрудников:' />
                                <div className='items half'>
                                    {persons.map(el =>
                                        <div onClick={() => setPerson(el)} className='item panel'>
                                            {centum.search(el.title)}
                                            <p className='pale'>{el.category}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPerson(null)} />

                                <h2>{person.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Роль: {person.category} ({person.status})</h4>
                                    <h4 className='pale'><b>{person.likes}</b> лайков</h4>
                                </div>  

                                {account.name === person.name ?
                                        <button onClick={() => onManagePerson('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManagePerson('like')}>Нравится</button>
                                }
                            </>
                    }

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker'  />
                        </Marker>
                    </ReactMapGL> 

                    <h4 className='pale'>Результаты сдачи ЕГЭ - <b>{rating}</b> баллов</h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                    
                    <select value={subject} onChange={e => setState({...state, subject: e.target.value})}>
                        {SUBJECTS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <ImageLoader setImage={setImage} />

                    <button onClick={onUpdateInformation} className='light'>Обновить</button>

                    {fact === null ?
                            <>
                                <h2>Игра "Правда/Ложь"</h2>
                                <h4 className='pale'>Результат: <b>{points}</b> баллов</h4>

                                <button onClick={onFact} className='light'>Сгенерировать</button>

                                <h2>Новый Факт</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Текст...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>
                                
                                <button onClick={() => setState({...state, isTrue: !isTrue})}>{isTrue ? 'Правда' : 'Ложь'}</button>

                                <button onClick={onPublishFact} className='light'>Опубликовать</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <p className='text'>Формулировка: {fact.text}</p>

                                <div className='items small'>
                                    <h4 className='pale'>Уровень сложности: {fact.level}</h4>
                                    <h4 className='pale'>Дата: {fact.dateUp}</h4>
                                </div>
                                
                                <button onClick={() => setState({...state, isTrue: !isTrue})}>{isTrue ? 'Правда' : 'Ложь'}</button>

                                <button onClick={onFact} className='light'>Проверить</button>
                            </>
                    }
                </>
            }

            {school === null && <Loading label='Загрузка учебного заведения' />}
        </div>
    )
}

export default School