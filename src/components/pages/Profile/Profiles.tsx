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
import {getProfilesQ} from './gql/queries'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {MapType, TownType, Cords} from '../../../env/types'

const Profiles: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [profiles, setProfiles] = useState<any[] | null>(null)

    const [name, setName] = useState<string>('')
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getProfilesQ)

    useLayoutEffect(() => {
        changeTitle('Profiles')
    
        if (data) {
            setProfiles(data.getProfiles)
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
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (name.length !== 0) {
                result = result.filter(el => centum.search(el.name, name, SEARCH_PERCENT))
            }
            
            setFiltered(result)
        }
    }, [profiles, name, region])

    return (
        <>
            <h2>Найдите друга или работника</h2>
            <div className='items small'>
                <input value={name} onChange={e => setName(e.target.value)} placeholder='Имя пользователя'  type='text' />
                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Регион' type='text' />
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Люди на карте:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker'  />
                    </Marker>
                    
                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/profile/${el.shortid}`}>
                                {centum.shorter(el.name)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL> 
            }

            {loading && <Loading label='Загрузка пользователей' />}
        </>
    )
}

export default Profiles