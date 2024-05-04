import React, {useState, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {getTownsFromStorage} from '../../../utils/storage'
import {changeTitle} from '../../../utils/notifications'
import RouterNavigator from '../../router/RouterNavigator'
import MapPicker from '../../../shared/UI/MapPicker'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import {getOrganizationsQ} from './gql/queries'
import {ORGANIZATION_TYPES, OWNERSHIP_TYPES} from './env'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {MapType, TownType, Cords} from '../../../env/types'

const Organizations: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [organizations, setOrganizations] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(ORGANIZATION_TYPES[0])
    const [format, setFormat] = useState<string>(OWNERSHIP_TYPES[0])
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getOrganizationsQ)

    useLayoutEffect(() => {
        changeTitle('Organizations')
    
        if (data) {
            setOrganizations(data.getOrganizations)
        }

    }, [data])

    useMemo(() => {
        if (region.length !== 0) {
            let result = towns.find(el => centum.search(el.translation, region, SEARCH_PERCENT, true))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(result.cords) 
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (organizations !== null) {
            let result: any[] = organizations.filter(el => el.format === format && el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }
            
            result = result.filter(el => el.category === category)

            setFiltered(result)
        }
    }, [organizations, title, category, format, region])

    return (
        <div className='main profile'>
            <h2>Поиск местных организаций</h2>
            <div className='items small'>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название' type='text' />
                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Регион' type='text' />
            </div>

            <div className='items small'>
                {ORGANIZATION_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>
            
            <select value={format} onChange={e => setFormat(e.target.value)}>
                {OWNERSHIP_TYPES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} label='Список на карте:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker'  />
                    </Marker>
                    
                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/organization/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL> 
            }

            {loading && <Loading label='Загрузка организаций' />}
        </div>
    )
}

export default Organizations