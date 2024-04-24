import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum, datus, maxMinutes} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {updateProfileInfo, getTownsFromStorage} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import FormPagination from '../../../shared/UI/FormPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import MapPicker from '../../../shared/UI/MapPicker'
import {createSchoolM} from './gql/mutations'
import {SCHOOL_TYPES, SUBJECTS, DEFAILT_RATING} from './env'
import {SEARCH_PERCENT, MAP_ZOOM, VIEW_CONFIG, token} from '../../../env/env'
import {ContextType, TownType, MapType, CollectionPropsType} from '../../../env/types'

const CreateSchool: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '', 
        category: SCHOOL_TYPES[0],  
        region: towns[0].translation, 
        cords: towns[0].cords, 
        subject: SUBJECTS[0], 
        rating: DEFAILT_RATING
    })

    const {title, category, region, cords, subject, rating} = state 

    useLayoutEffect(() => {
        changeTitle('New School')
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
    
    const [createSchool] = useMutation(createSchoolM, {
        onCompleted(data) {
            buildNotification(data.createSchool)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createSchool({
            variables: {
                name: account.name, id, title, category, region, cords, subject, rating, image
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>    
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название...' />
          
                    <div className='items small'>
                        {SCHOOL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div> 

                    <h4 className='pale'>Результаты сдачи ЕГЭ - <b>{rating}</b> баллов</h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                    
                    <select value={subject} onChange={e => setState({...state, subject: e.target.value})}>
                        {SUBJECTS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <ImageLoader setImage={setImage} />
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
                <h2>Новая Учереждение</h2>
                |
                <button onClick={onCreate}>Создать</button>
            </FormPagination>  
        </>
    )
}

export default CreateSchool