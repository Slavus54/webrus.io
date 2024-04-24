import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import ProfilePhoto from '../../../assets/photo/profile_photo.jpg'
import {AppContext} from '../../../context/AppContext'
import MapPicker from '../../../shared/UI/MapPicker'
import CloseIt from '../../../shared/UI/CloseIt'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLook from '../../../shared/UI/ImageLook'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updatePages} from '../../../utils/storage'
import Loading from '../../../shared/UI/Loading'
import {getProfileM, manageProfileAchievementM} from './gql/mutations'
import {TG_ICON, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, CollectionPropsType, MapType, Cords} from '../../../env/types'

const Profile: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [achievements, setAchievements] = useState<any[]>([])
    const [achievement, setAchievement] = useState<any | null>(null)
    const [careers, setCareers] = useState<any[]>([])
    const [career, setCareer] = useState<any | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [rating, setRating] = useState<number>(0)

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileAchievement] = useMutation(manageProfileAchievementM, {
        onCompleted(data) {
            buildNotification(data.manageProfileAchievement)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Profile')
    
        if (account.shortid !== '') {
            getProfile({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useMemo(() => {
        if (profile !== null) {
            setImage(profile.image === '' ? ProfilePhoto : profile.image) 
            setCords(profile.cords)

            updatePages(profile.name, 'profile', window.location.pathname, datus.timestamp())
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (achievement !== null) {
            setRating(achievement.rating)
        }
    }, [achievement])

    const onView = () => {
        centum.go(profile.telegram, 'telegram')
    }

    const onRateAchievement = () => {
        manageProfileAchievement({
            variables: {
                id: profile.shortid, option: 'rate', text: '', category: '', language: '', url: '', image: '', rating, dateUp: '', coll_id: achievement.shortid
            }
        })
    }

    return (
        <div className='main profile'>
            {profile !== null &&
                <>
                    <ImageLook src={image} className='photo' alt='account photo' />
                    <h2>{profile.name}</h2>
                    <h4 className='pale'>Очков набрано: {profile.points}</h4>

                    <ImageLook onClick={onView} src={TG_ICON} min={2} max={2} className='icon' alt='icon' />

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 

                    {achievement === null ?
                            <>
                                <DataPagination items={profile.achievements} setItems={setAchievements} label='Достижения:' />
                                <div className='items half'>
                                    {achievements.map(el => 
                                        <div onClick={() => setAchievement(el)} className='item panel'>
                                            {centum.shorter(el.text, 4)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setAchievement(null)} />

                                {achievement.image !== '' && <ImageLook src={achievement.image} className='photo' alt='achievement photo' />}

                                <h2>{achievement.text} ({achievement.dateUp})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {achievement.category}</h4>
                                    <h4 className='pale'>Язык: {achievement.language}</h4>
                                </div>

                                <p>Рейтинг: <b>{rating}%</b></p>
                                <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />

                                <button onClick={onRateAchievement}>Оценить</button>
                            </>
                    }
                </>
            }

            {profile === null && <Loading label='Загрузка страницы пользователя' />}
        </div>
    )
}

export default Profile