import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updatePages} from '../../../utils/storage'
import RouterNavigator from '../../router/RouterNavigator'
import MapPicker from '../../../shared/UI/MapPicker'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import {getVacancyM, updateVacancyRateM, manageVacancyPollM, manageVacancyPhotoM} from './gql/mutations'
import {POLL_TYPES, PHOTO_TYPES, RATE_PERCENT} from './env'
import {VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {CollectionPropsType, ContextType, MapType, Cords} from '../../../env/types'

const Vacancy: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [percent, setPercent] = useState<number>(RATE_PERCENT)
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [image, setImage] = useState<string>('')
   
    const [poll, setPoll] = useState<any | null>(null)
    const [photos, setPhotos] = useState<any[]>([])
    const [photo, setPhoto] = useState<any | null>(null)
    const [vacancy, setVacancy] = useState<any | null>(null)

    const [state, setState] = useState({
        text: '',
        category: POLL_TYPES[0],
        reply: '',
        title: '',
        format: PHOTO_TYPES[0],
        dateUp: datus.timestamp('date'),
        salary: 0,
        msg: ''
    })

    const {text, category, reply, title, format, dateUp, salary, msg} = state

    const [getVacancy] = useMutation(getVacancyM, {
        onCompleted(data) {
            setVacancy(data.getVacancy)
        }
    })

    const [updateVacancyRate] = useMutation(updateVacancyRateM, {
        onCompleted(data) {
            buildNotification(data.updateVacancyRate)
        }
    })

    const [manageVacancyPoll] = useMutation(manageVacancyPollM, {
        onCompleted(data) {
            buildNotification(data.manageVacancyPoll)
        }
    })

    const [manageVacancyPhoto] = useMutation(manageVacancyPhotoM, {
        onCompleted(data) {
            buildNotification(data.manageVacancyPhoto)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Vacancy')
    
        if (account.shortid !== '') {
            getVacancy({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useMemo(() => {
        if (vacancy !== null) {
            setIsAuthor(vacancy.name === account.name)
            setCords(vacancy.cords)

            updatePages(vacancy.title, 'vacancy', window.location.pathname, datus.timestamp())
        }
    }, [vacancy])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (vacancy !== null) {
            let result: number = centum.part(percent, vacancy.salary, 0)

            setState({...state, salary: result})
        }
    }, [percent])

    useMemo(() => {
        setState({...state, reply: poll === null ? '' : poll.reply})
    }, [poll])

    const onOpenPoll = () => {
        let result = centum.random(vacancy.polls)?.value

        if (result !== undefined) {
            setPoll(result)
        }
    }

    const onUpdateRate = () => {
        updateVacancyRate({
            variables: {
                name: account.name, id, msg, salary, rates: 1
            }
        })
    }

    const onManagePoll = (option: string) => {
        manageVacancyPoll({
            variables: {
                name: account.name, id, option, text, category, reply, coll_id: poll === null ? '' : poll.shortid
            }
        })
    }

    const onManagePhoto = (option: string) => {
        manageVacancyPhoto({
            variables: {
                name: account.name, id, option, title, format, image, dateUp, likes: option === 'create' ? 0 : 1, coll_id: photo === null ? '' : photo.shortid
            }
        })
    }

    return (
        <div className='main profile'>
            {vacancy !== null &&
                <>
                    <h2>{vacancy.title}</h2>
                    
                    <div className='items small'>
                        <h4 className='pale'>Сфера: {vacancy.category}</h4>
                        <h4 className='pale'>Позиция: {vacancy.stage}</h4>
                    </div>

                    {isAuthor ?
                            <>
                                <h2>Ставки для вакансии</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Минимальная ставка: <b>{vacancy.salary}</b> рублей</h4>
                                    <h4 className='pale'>Общее количество: <b>{vacancy.rates}</b></h4>
                                </div>

                                {vacancy.candidate !== '' &&
                                    <RouterNavigator url={`/profile/${vacancy.candidate}`}>
                                        <button className='light'>Кандидат</button>
                                    </RouterNavigator>
                                }

                                <h2>Новая Фотография</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />

                                <div className='items small'>
                                    {PHOTO_TYPES.map(el => <div onClick={() => setState({...state, format: el})} className={el === format ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>
                            
                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManagePhoto('create')}>Опубликовать</button>
                            </>
                        :
                            <>
                                <h2>Ваша ставка</h2>

                                <textarea value={msg} onChange={e => setState({...state, msg: e.target.value})} placeholder='Сообщение...' />

                                <h4 className='pale'>Заработная плата: <b>{salary}₽</b></h4>
                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                                <button onClick={onUpdateRate} className='light'>Сделать</button>

                                <h2>Новый Опрос</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Текст...' />

                                <div className='items small'>
                                    {POLL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <button onClick={() => onManagePoll('create')}>Отправить</button>
                            </>
                    }

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker'  />
                        </Marker>
                    </ReactMapGL>

                    {poll === null ?
                            <>
                                <h2>Опросы вакансии</h2>

                                <button onClick={onOpenPoll} className='light'>Сгенерировать</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPoll(null)} />

                                <h2>Формулировка: {poll.text}</h2>

                                <h4 className='pale'>Тема: {poll.category}</h4>

                                {account.name === poll.name && <button onClick={() => onManagePoll('delete')}>Удалить</button>}

                                {!isAuthor &&
                                    <>
                                        <h4>Ваша реплика</h4>

                                        <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Текст...' />

                                        <button onClick={() => onManagePoll('reply')}>Ответить</button>
                                    </>
                                }
                            </>
                    } 

                    {photo === null ?
                            <>
                                <DataPagination items={vacancy.photos} setItems={setPhotos} label='Галерея:' />
                                <div className='items half'>
                                    {photos.map(el => 
                                        <div onClick={() => setPhoto(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPhoto(null)} />

                                {photo.image !== '' && <ImageLook src={photo.image} className='photo' alt='photo' />}

                                <h2>{photo.title} ({photo.dateUp})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {photo.format}</h4>
                                    <h4 className='pale'><b>{photo.likes}</b> лайков</h4>
                                </div>

                                {isAuthor ? 
                                        <button onClick={() => onManagePhoto('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManagePhoto('like')}>Нравится</button>
                                }
                            </>
                    }
                </>
            }

            {vacancy === null && <Loading label='Загрузка страницы вакансии' />}
        </div>
    )
}

export default Vacancy