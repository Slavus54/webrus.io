import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {AppContext} from '../../../context/AppContext'
import {useMutation} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import RouterNavigator from '../../router/RouterNavigator'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import MapPicker from '../../../shared/UI/MapPicker'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import {getAssemblyM, manageAssemblyStatusM, updateAssemblyInformationM, manageAssemblyLocationM} from './gql/mutations'
import {LOCATION_TYPES} from './env'
import {STAGES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {CollectionPropsType, ContextType, MapType, Cords} from '../../../env/types'

const Assembly: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [participants, setParticipants] = useState<any[]>([])
    const [personality, setPersonality] = useState<any | null>(null)
    const [assembly, setAssembly] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
 
    const [state, setState] = useState({
        position: STAGES[0],
        url: '',
        rating: 0,
        title: '',
        category: LOCATION_TYPES[0]
    })

    const {position, url, rating, title, category} = state

    const [getAssembly] = useMutation(getAssemblyM, {
        onCompleted(data) {
            setAssembly(data.getAssembly)
        }
    })

    const [manageAssemblyStatus] = useMutation(manageAssemblyStatusM, {
        onCompleted(data) {
            buildNotification(data.manageAssemblyStatus)
        }
    })

    const [updateAssemblyInformation] = useMutation(updateAssemblyInformationM, {
        onCompleted(data) {
            buildNotification(data.updateAssemblyInformation)
        }
    })

    const [manageAssemblyLocation] = useMutation(manageAssemblyLocationM, {
        onCompleted(data) {
            buildNotification(data.manageAssemblyLocation)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Assembly')
    
        if (account.shortid !== '') {
            getAssembly({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useMemo(() => {
        if (assembly !== null) {
            let participant = assembly.participants.find(el => centum.search(el.shortid, account.shortid, 100))

            if (participant !== undefined) {
                setPersonality(participant)
            }

            setState({...state, url: assembly.url, rating: assembly.rating})

            setCords(assembly.cords)
        }
    }, [assembly])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const onManageStatus = (option: string) => {
        manageAssemblyStatus({
            variables: {
                name: account.name, id, option, position
            }
        })
    }

    const onUpdateInformation = () => {
        updateAssemblyInformation({
            variables: {
                name: account.name, id, url, rating
            }
        })
    }

    const onManageLocation = (option: string) => {
        manageAssemblyLocation({
            variables: {
                name: account.name, id, option, title, category, image, cords, likes: Number(location !== null), coll_id: location === null ? '' : location.shortid
            }
        })
    }

    return (
        <>
            {assembly !== null && personality === null &&
                <>
                    <h2>Добро пожаловать на ассамблею!</h2>
                    <h4 className='pale'>{assembly.title}</h4>

                    <select value={position} onChange={e => setState({...state, position: e.target.value})}>
                        {STAGES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('join')}>Присоединиться</button>
                </>
            }

            {assembly !== null && personality !== null &&
                <>
                    <h2>{assembly.title}</h2>
                    <p>Начало: {assembly.dateUp} в {assembly.time}</p>

                    <div className='items small'>
                        <h4 className='pale'>Темы: {assembly.category}</h4>
                        <h4 className='pale'>Язык: {assembly.language}</h4>
                    </div>

                    {location === null ?
                            <>
                                <h2>Новое Место</h2>
                                <h4 className='pale'>Составьте маршрут с прекрасными локациями</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />

                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageLocation('create')}>Предложить</button>

                                <DataPagination items={assembly.locations} setItems={setLocations} label='Список мест на карте:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />

                                {location.image !== '' && <ImageLook src={location.image} className='photo' alt='location photo' />} 

                                <h2>{location.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {location.category}</h4>
                                    <h4 className='pale'><b>{location.likes}</b> лайков</h4>
                                </div>

                                {account.name === location.name ?
                                        <button onClick={() => onManageLocation('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageLocation('like')}>Нравится</button>
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        {assembly.cords.lat !== cords.lat &&
                            <Marker latitude={assembly.cords.lat} longitude={assembly.cords.long}>
                                <MapPicker type='home'  />
                            </Marker>
                        }

                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker'  />
                        </Marker>
                        
                        {locations.map(el => 
                            <Marker onClick={() => setLocation(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL> 

                    <h2>Ролик от Е.Н. Понасенкова</h2>

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                    <h4 className='pale'>Рейтинг: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateInformation} className='light'>Обновить</button>

                    <DataPagination items={assembly.participants} setItems={setParticipants} label='Список участников:' />
                    <div className='items half'>
                        {participants.map(el => 
                            <div className='item panel'>
                                <RouterNavigator url={`/profile/${el.shortid}`}>
                                    {el.name}
                                    <p className='pale'>{el.position}</p>
                                </RouterNavigator>
                            </div>
                        )}
                    </div>

                    <button onClick={() => onManageStatus('exit')}>Выйти</button>
                </>
            }

            {assembly === null && <Loading label='Загрузка страницы ассамблеи' />}
        </>
    )
}

export default Assembly