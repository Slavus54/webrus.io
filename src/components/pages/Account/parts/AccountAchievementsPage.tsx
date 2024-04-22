import React, {useState, useEffect} from 'react'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../../shared/libs/libs'
import DataPagination from '../../../../shared/UI/DataPagination'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import CloseIt from '../../../../shared/UI/CloseIt'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {manageProfileAchievementM} from '../gql/mutations'
import {ACHIEVEMENT_TYPES, DEFAULT_RATING} from '../env'
import {LANGUAGES} from '../../../../env/env'
import {AccountPropsType} from '../../../../env/types'

const AccountAchievementsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [achievements, setAchievements] = useState<any[]>([])
    const [achievement, setAchievement] = useState<any | null>(null)
    
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        category: ACHIEVEMENT_TYPES[0],
        language: LANGUAGES[0],
        url: '',
        rating: DEFAULT_RATING,
        dateUp: datus.timestamp('date')
    })

    const {text, category, language, url, rating, dateUp} = state

    const [manageProfileAchievement] = useMutation(manageProfileAchievementM, {
        onCompleted(data) {
            buildNotification(data.manageProfileAchievement)
            updateProfileInfo(null)
        }
    })

    useEffect(() => {
        setImage(achievement === null ? '' : achievement.image)
    }, [achievement])

    const onManageAchievement = (option: string) => {
        manageProfileAchievement({
            variables: {
                id: profile.shortid, option, text, category, language, url, image, rating, dateUp, coll_id: achievement === null ? '' : achievement.shortid
            }
        })
    }

    return (
        <div className='main profile'>
            {achievement === null ?
                    <>
                        <h2>Новое Достижение</h2>
                        <h4 className='pale'>Опубликуйте свои web-проекты с открытым кодом</h4>

                        <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                        <div className='items small'>
                            {ACHIEVEMENT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                            {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='https://github.com' type='text' />

                        <ImageLoader setImage={setImage} />
                
                        <button onClick={() => onManageAchievement('create')}>Создать</button>

                        <DataPagination items={profile.achievements} setItems={setAchievements} label='Список достижений:' />
                        <div className='items half'>
                            {achievements.map(el => 
                                <div onClick={() => setAchievement(el)} className='item panel'>
                                    {centum.shorter(el.text)}
                                    <p className='pale'>{el.category}</p>
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setAchievement(null)} />

                        {image !== '' && <ImageLook src={image} className='photo' alt='achievement photo' />}

                        <h2>{achievement.text} ({achievement.dateUp})</h2>

                        <div className='items small'>
                            <h4 className='pale'>Тип: {achievement.category}</h4>
                            <h4 className='pale'>Язык: {achievement.language}</h4>
                        </div>

                        <ImageLoader setImage={setImage} />

                        <p>Интерес пользователей: <b>{achievement.rating}%</b></p>

                        <div className='items small'>
                            <button onClick={() => onManageAchievement('delete')}>Удалить</button>
                            <button onClick={() => onManageAchievement('update')}>Обновить</button>
                        </div>
                    </>
            } 
        </div>
    )
}

export default AccountAchievementsPage