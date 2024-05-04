import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {updateProfileInfo, getTownsFromStorage} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import FormPagination from '../../../shared/UI/FormPagination'
import MapPicker from '../../../shared/UI/MapPicker'
import {createOrganizationM} from './gql/mutations'
import {ORGANIZATION_TYPES, OWNERSHIP_TYPES, PRODUCT_TYPES, DEFAILT_RATING} from './env'
import {SEARCH_PERCENT, MAP_ZOOM, VIEW_CONFIG, token} from '../../../env/env'
import {ContextType, TownType, MapType, CollectionPropsType} from '../../../env/types'

const CreateOrganization: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '', 
        category: ORGANIZATION_TYPES[0],  
        format: OWNERSHIP_TYPES[0],
        region: towns[0].translation, 
        cords: towns[0].cords, 
        url: '', 
        product: PRODUCT_TYPES[0],
        rating: DEFAILT_RATING
    })

    const {title, category, format, region, cords, url, product, rating} = state 

    useLayoutEffect(() => {
        changeTitle('New Organization')
    }, [])

    useMemo(() => {
        if (region.length !== 0) {
            let result = towns.find(el => centum.search(el.translation, region, SEARCH_PERCENT, true))

            if (result !== undefined) {
                setState({...state, region: result.translation, cords: result.cords})
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])
    
    const [createOrganization] = useMutation(createOrganizationM, {
        onCompleted(data) {
            buildNotification(data.createOrganization)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createOrganization({
            variables: {
                name: account.name, id, title, category, format, region, cords, url, product, rating
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>    
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название...' />
          
                    <div className='items small'>
                        {ORGANIZATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div> 

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />                   
                    
                    <h4 className='pale'>Тип собственности и IT-продукт</h4>
                    <div className='items small'>
                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {OWNERSHIP_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={product} onChange={e => setState({...state, product: e.target.value})}>
                            {PRODUCT_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <h4 className='pale'>Оценка: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                </>,
                <>
                    <h4 className='pale'>Где это находится?</h4>
                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />           

                    <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
            ]}>
                <h2>Новая Организация</h2>
                |
                <button onClick={onCreate}>Создать</button>
            </FormPagination>  
        </>
    )
}

export default CreateOrganization