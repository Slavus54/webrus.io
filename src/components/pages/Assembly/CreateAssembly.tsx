import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum, datus, maxMinutes} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {updateProfileInfo, getTownsFromStorage} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import FormPagination from '../../../shared/UI/FormPagination'
import MapPicker from '../../../shared/UI/MapPicker'
import CounterView from '../../../shared/UI/CounterView'
import {createAssemblyM} from './gql/mutations'
import {ASSEMBLY_TYPES, DATES_LENGTH, ASSEMBLY_DEFALT_COST, ASSEMBLY_DEFALT_RATING, TIME_PART} from './env'
import {LANGUAGES, STAGES, SEARCH_PERCENT, MAP_ZOOM, VIEW_CONFIG, token} from '../../../env/env'
import {ContextType, TownType, MapType, CollectionPropsType} from '../../../env/types'

const CreateAssembly: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [dates] = useState<string[]>(datus.dates('day', DATES_LENGTH))
    const [timer, setTimer] = useState<number>(maxMinutes / 3)

    const [state, setState] = useState({
        title: '', 
        category: ASSEMBLY_TYPES[0], 
        language: LANGUAGES[0], 
        region: towns[0].translation, 
        cords: towns[0].cords, 
        dateUp: dates[0], 
        time: '', 
        url: '',
        rating: ASSEMBLY_DEFALT_RATING, 
        position: STAGES[0], 
        points: ASSEMBLY_DEFALT_COST 
    })

    const {title, category, language, region, cords, dateUp, time, url, rating, position, points} = state 

    useLayoutEffect(() => {
        changeTitle('New Assembly')
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

    useMemo(() => {
        let result: string = datus.time(timer)

        setState({...state, time: result})
    }, [timer])
    
    const [createAssembly] = useMutation(createAssemblyM, {
        onCompleted(data) {
            buildNotification(data.createAssembly)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createAssembly({
            variables: {
                name: account.name, id, title, category, language, region, cords, dateUp, time, url, rating, position, points
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>    
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название...' />
          
                    <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                        {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <div className='items small'>
                        {ASSEMBLY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div>                   
          
                    <h4 className='pale'>Стоимость: <b>{ASSEMBLY_DEFALT_COST}</b> очков</h4>    
                </>,
                <>
                    <h4 className='pale'>Организация и позиция</h4>

                    <div className='items small'>
                        {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={el === dateUp ? 'item label active' : 'item label'}>{el}</div>)}
                    </div>

                    <select value={position} onChange={e => setState({...state, position: e.target.value})}>
                        {STAGES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <CounterView num={timer} setNum={setTimer} part={TIME_PART} min={maxMinutes / 3} max={maxMinutes}>
                        Начало в {time}
                    </CounterView>    
                </>,
                <>
                    <h4 className='pale'>Центр встречи</h4>
                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />           

                    <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
            ]}>
                <h2>Новая Ассамблея</h2>
                |
                {account.points >= ASSEMBLY_DEFALT_COST && <button onClick={onCreate}>Создать</button>}
            </FormPagination>  
        </>
    )
}

export default CreateAssembly