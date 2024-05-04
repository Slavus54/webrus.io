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
import {getOrganizationM, makeOrganizationServiceM, updateOrganizationInformationM, manageOrganizationFeatureM} from './gql/mutations'
import {SERVICE_TYPES, PRODUCT_TYPES, DEFAILT_RATING, FEATURE_TYPES, FEATURE_STATUSES} from './env'
import {LEVELS, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {CollectionPropsType, MapType, ContextType, Cords} from '../../../env/types'

const Organization: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [services, setServices] = useState<any[]>([])
    const [service, setService] = useState<any | null>(null)
    const [features, setFeatures] = useState<any[]>([])
    const [feature, setFeature] = useState<any | null>(null)
    const [organization, setOrganization] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        format: SERVICE_TYPES[0],
        level: LEVELS[-0],
        dateUp: datus.timestamp('date'),
        url: '',
        product: PRODUCT_TYPES[0],
        rating: DEFAILT_RATING,
        title: '',
        category: FEATURE_TYPES[0],
        status: FEATURE_STATUSES[0]
    })

    const {text, format, level, dateUp, url, product, rating, title, category, status} = state

    const [getOrganization] = useMutation(getOrganizationM, {
        onCompleted(data) {
            setOrganization(data.getOrganization)
        }
    })

    const [makeOrganizationService] = useMutation(makeOrganizationServiceM, {
        onCompleted(data) {
            buildNotification(data.makeOrganizationService, 'Organization')
        }
    })

    const [updateOrganizationInformation] = useMutation(updateOrganizationInformationM, {
        onCompleted(data) {
            buildNotification(data.updateOrganizationInformation, 'Organization')
        }
    })

    const [manageOrganizationFeature] = useMutation(manageOrganizationFeatureM, {
        onCompleted(data) {
            buildNotification(data.manageOrganizationFeature, 'Organization')
        }
    })
    
    useLayoutEffect(() => {
        changeTitle('Organization')
    
        if (account.shortid !== '') {
            getOrganization({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useMemo(() => {
        if (organization !== null) {
            
            setState({...state, url: organization.url, product: organization.product, rating: organization.rating})
            setCords(organization.cords)
            updatePages(organization.title, 'organization', window.location.pathname, datus.timestamp())
        }
    }, [organization])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (organization !== null) {
            let flag: boolean = feature !== null

            setState({...state, status: flag ? feature.status : FEATURE_STATUSES[0]})
            setImage(flag ? feature.image : '')
        }
    }, [feature])

    const onMakeService = () => {
        makeOrganizationService({
            variables: {
                name: account.name, id, text, format, level, dateUp
            }
        })
    }

    const onUpdateInfo = () => {
        updateOrganizationInformation({
            variables: {
                name: account.name, id, url, product, rating
            }
        })
    }

    const onManageFeature = (option: string) => {
        manageOrganizationFeature({
            variables: {
                name: account.name, id, option, title, category, status, image, likes: Number(feature !== null), coll_id: feature !== null ? feature.shortid : ''
            }
        })
    }

    return (
        <div className='main profile'>
            {organization !== null &&
                <>
                    <h2>{organization.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Сфера: {organization.category}</h4>
                        <h4 className='pale'>Тип: {organization.format}</h4>
                    </div>

                    {service === null ?
                            <>
                                <h2>Новая Услуга</h2>
                                <h4 className='pale'>Что предлагает эта организация?</h4>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />
                                
                                <h4 className='pale'>Тип услуги и уровень качества</h4>
                                <div className='items small'>
                                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                        {SERVICE_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <button onClick={onMakeService}>Добавить</button>

                                <DataPagination items={organization.services} setItems={setServices} label='Список публичных услуг:' />
                                <div className='items small'>
                                    {services.map(el => 
                                        <div onClick={() => setService(el)} className='item card'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setService(null)} />

                                <h2>{service.text} ({service.dateUp})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {service.format}</h4>
                                    <h4 className='pale'>Уровень качества: {service.level}</h4>
                                </div>
                            </>
                    }


                    <h2>IT-Инфраструктура организации</h2>

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />  

                    <select value={product} onChange={e => setState({...state, product: e.target.value})}>
                        {PRODUCT_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <h4 className='pale'>Оценка: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateInfo} className='light'>Обновить</button>

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker'  />
                        </Marker>
                    </ReactMapGL>

                    {feature === null ?
                            <>
                                <h2>Новое IT-Решение</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Ваше предложение...' />

                                <div className='items small'>
                                    {FEATURE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                    {FEATURE_STATUSES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageFeature('create')}>Опубликовать</button>

                                <DataPagination items={organization.features} setItems={setFeatures} label='Список актуальных решений:' />
                                <div className='items small'>
                                    {features.map(el => 
                                        <div onClick={() => setFeature(el)} className='item card'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.category}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFeature(null)} />

                                {image !== '' && <ImageLook src={image} className='photo' alt='feature photo' />}

                                <h2>{feature.title} ({feature.status})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {feature.category}</h4>
                                    <h4 className='pale'><b>{feature.likes}</b> лайков</h4>
                                </div>

                                {account.name === feature.name ?
                                        <>
                                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                                {FEATURE_STATUSES.map(el => <option value={el}>{el}</option>)}
                                            </select>

                                            <ImageLoader setImage={setImage} />

                                            <div className='items small'>
                                                <button onClick={() => onManageFeature('delete')}>Удалить</button>
                                                <button onClick={() => onManageFeature('update')}>Обновить</button>
                                            </div>
                                        </>
                                    :
                                        <button onClick={() => onManageFeature('like')}>Опубликовать</button>
                                }
                            </>
                    }
                </>
            }

            {organization === null && <Loading label='Загрузка страницы организации' />}
        </div>
    )
}

export default Organization