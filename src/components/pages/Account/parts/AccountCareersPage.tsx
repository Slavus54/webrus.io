import React, {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {centum} from '../../../../shared/libs/libs'
import DataPagination from '../../../../shared/UI/DataPagination'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import CloseIt from '../../../../shared/UI/CloseIt'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {manageProfileCareerM} from '../gql/mutations'
import {CAREER_TYPES, EXPERIENCE_LIMIT, DEFAULT_PERCENT} from '../env'
import {WEB_DIRECTIONS, DEFAULT_SALARY} from '../../../../env/env'
import {AccountPropsType} from '../../../../env/types'

const AccountCareersPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [careers, setCareers] = useState<any[]>([])
    const [career, setCareer] = useState<any | null>(null)
    
    const [image, setImage] = useState<string>('')
    const [percent, setPercent] = useState<number>(DEFAULT_PERCENT)

    const [state, setState] = useState({
        title: '', 
        direction: WEB_DIRECTIONS[0], 
        format: CAREER_TYPES[0],
        experience: 0, 
        salary: DEFAULT_SALARY, 
        respects: 0
    })

    const {title, direction, format, experience, salary, respects} = state
 
    const [manageProfileCareer] = useMutation(manageProfileCareerM, {
        onCompleted(data) {
            buildNotification(data.manageProfileCareer)
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let result: number = centum.part(percent, EXPERIENCE_LIMIT, 0)

        setState({...state, experience: result})
    }, [percent])

    const onManageCareer = (option: string) => {
        manageProfileCareer({
            variables: {
                id: profile.shortid, option, title, direction, format, experience, salary, image, respects, coll_id: career === null ? '' : career.shortid
            }
        })
    }

    return (
        <div className='main profile'>
            {career === null ?
                    <>
                        <h2>Новый Эпизод</h2>
                        <h4 className='pale'>Поделитесь информацией о вашей карьере</h4>

                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Компания или биржа' type='text' />

                        <div className='items small'>
                            {WEB_DIRECTIONS.map(el => <div onClick={() => setState({...state, direction: el})} className={el === direction ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {CAREER_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <h4 className='pale'>Выручка ($)</h4>
                        <input value={salary} onChange={e => setState({...state, salary: parseInt(e.target.value)})} placeholder='Выручка' type='text' />

                        <h4 className='pale'>Длительность: <b>{experience} месяцев</b></h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                        <ImageLoader setImage={setImage} />
                
                        {isNaN(salary) ?
                                <button onClick={() => setState({...state, salary: DEFAULT_SALARY})}>Сбросить</button>
                            :
                                <button onClick={() => onManageCareer('create')}>Опубликовать</button>
                        }

                        <DataPagination items={profile.careers} setItems={setCareers} label='Эпизоды карьеры:' />
                        <div className='items half'>
                            {careers.map(el => 
                                <div onClick={() => setCareer(el)} className='item panel'>
                                    {centum.shorter(el.title)}
                                    <p className='pale'>{el.direction}</p>
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setCareer(null)} />

                        {career.image !== '' && <ImageLook src={career.image} className='photo' alt='career photo' />}

                        <h2>{career.title}</h2>

                        <div className='items small'>
                            <h4 className='pale'>Сфера: {career.direction}</h4>
                            <h4 className='pale'>Формат: {career.format}</h4>
                        </div>

                        <ImageLoader setImage={setImage} />

                        <p>Длительность: <b>{career.experience} месяцев</b></p>

                        <button onClick={() => onManageCareer('delete')}>Удалить</button>
                    </>
            } 
        </div>
    )
}

export default AccountCareersPage