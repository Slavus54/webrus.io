import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {updateProfileInfo, getTownsFromStorage} from '../../../utils/storage'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import FormPagination from '../../../shared/UI/FormPagination'
import MapPicker from '../../../shared/UI/MapPicker'
import CounterView from '../../../shared/UI/CounterView'
import {createVacancyM} from './gql/mutations'
import {EXPERIENCE_LIMIT, EXPERIENCE_PART} from './env'
import {WEB_DIRECTIONS, STAGES, DEFAULT_SALARY, SEARCH_PERCENT, MAP_ZOOM, VIEW_CONFIG, token} from '../../../env/env'
import {ContextType, TownType, MapType, CollectionPropsType} from '../../../env/types'

const CreateVacancy: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [experience, setExperience] = useState<number>(EXPERIENCE_LIMIT / 2)

    const [state, setState] = useState({
        title: '', 
        category: WEB_DIRECTIONS[0], 
        stage: STAGES[0], 
        url: '', 
        salary: DEFAULT_SALARY, 
        region: towns[0].translation, 
        cords: towns[0].cords, 
        candidate: '', 
        msg: '',
        rates: 0
    })

    const {title, category, stage, url, salary, region, cords, candidate, msg, rates} = state 

    useLayoutEffect(() => {
        changeTitle('New Vacancy')
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
    
    const [createVacancy] = useMutation(createVacancyM, {
        onCompleted(data) {
            buildNotification(data.createVacancy)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createVacancy({
            variables: {
                name: account.name, id, title, category, stage, url, salary, region, cords, candidate, msg, rates
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>    
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название...' />

                    <div className='items small'>
                        {WEB_DIRECTIONS.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                    </div>

                    <select value={stage} onChange={e => setState({...state, stage: e.target.value})}>
                        {STAGES.map(el => <option value={el}>{el}</option>)}
                    </select>
                 
                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                    <CounterView num={experience} setNum={setExperience} part={EXPERIENCE_PART} min={0} max={EXPERIENCE_LIMIT}>
                        Опыт работы: {experience} лет
                    </CounterView>
                </>,
                <>
                    <div className='items small'>
                        <div className='item'>
                            <h4 className='pale'>Локация</h4>
                            <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                        </div>
                        
                        <div className='item'>
                            <h4 className='pale'>Зарплата ($)</h4>
                            <input value={salary} onChange={e => setState({...state, salary: parseInt(e.target.value)})} placeholder='Заработная плата' type='text' />
                        </div>                       
                    </div>

                    <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
            ]}>
                <h2>Новая Вакансия</h2>
                |
                {isNaN(salary) ? 
                        <button onClick={() => setState({...state, salary: DEFAULT_SALARY})}>Сбросить</button>
                    :
                        <button onClick={onCreate}>Создать</button>
                }
            </FormPagination>  
        </>
    )
}

export default CreateVacancy