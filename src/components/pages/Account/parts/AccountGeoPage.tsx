import React, {useState, useEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum} from '../../../../shared/libs/libs'
import MapPicker from '../../../../shared/UI/MapPicker'
import {updateProfileInfo, getTownsFromStorage} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfileGeoInfoM} from '../gql/mutations'
import {SEARCH_PERCENT, MAP_ZOOM, VIEW_CONFIG, token} from '../../../../env/env'
import {AccountPropsType, Cords, TownType, MapType} from '../../../../env/types'

const AccountGeoPage: React.FC<AccountPropsType> = ({profile}) => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isHome, setIsHome] = useState<boolean>(true)
    const [region, setRegion] = useState<string>(profile.region)
    const [cords, setCords] = useState<Cords>({lat: profile.cords.lat, long: profile.cords.long})

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => centum.search(el.translation, region, SEARCH_PERCENT, true))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(isHome ? {lat: profile.cords.lat, long: profile.cords.long} : result.cords) 
            }
        }
    }, [region])

    useEffect(() => {
        if (isHome) {
            setIsHome(false)
        }

        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const [updateProfileGeoInfo] = useMutation(updateProfileGeoInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfileGeoInfo)
            updateProfileInfo(null)
        }
    })
  
    const onUpdate = () => {
        updateProfileGeoInfo({
            variables: {
                id: profile.shortid, region, cords
            }
        })
    }

    return (
        <div className='main profile'>
            <h2>Мой Регион</h2>
            <h4 className='pale'>Ваше местонахождение на данный момент</h4>

            <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Регион' type='text' />
            
            <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                <Marker latitude={cords.lat} longitude={cords.long}>
                    <MapPicker type={isHome ? 'home' : 'picker'}  />
                </Marker>
            </ReactMapGL> 

            <button onClick={onUpdate}>Обновить</button>
        </div>
    )
}

export default AccountGeoPage