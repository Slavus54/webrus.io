import React, {useState, useLayoutEffect, useEffect} from 'react'
import {atom, useRecoilValue, useSetRecoilState, RecoilEnv} from 'recoil'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import ImageLook from '../../../shared/UI/ImageLook'
import {WAGES, DEFAULT_PERCENT, ARCHITECTURE_FOUNDATION_ICON, ARCHITECTURE_FOUNDATION_URL, HISTORIAN_ICON, HISTORIAN_URL} from './env'
import {WageType} from '../../../env/types'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

const About: React.FC = () => {
    const [wage, setWage] = useState<WageType>(WAGES[0])

    const valueState = atom({
        key: 'value',
        default: 0
    })

    const value = useRecoilValue(valueState)
    const setValue = useSetRecoilState(valueState)

    const [percent, setPercent] = useState<number>(DEFAULT_PERCENT)   

    useLayoutEffect(() => {
        changeTitle('About')
    }, [])

    useEffect(() => {
        if (wage !== null) {
            let result: number = centum.part(percent, wage.value, 0)

            setValue(result)
        }
    }, [wage, percent])

    const onView = (url: string) => {
        centum.go(url)
    }

    return (
        <>
            <p className='text article'>
                <b>Цель проекта</b> - формирование творческого и культурно развитого сообщества среди web-программистов России.

                Функцинал позволяет обучаться, практиковаться и искать работу в IT, общаясь и делясь собственными наработками с другими пользователями.

                Вы можете устраивать ассамблеи, на которых обсуждаются темы искусства и науки, а также, составлять интересный маршрут по городу.
            </p>

            <div className='items half'>
                    {WAGES.map(el =>
                        <div onClick={() => setWage(el)} className='item panel'>
                            {el.title}
                            <h5 className='pale'>{el.position}</h5>
                            <b>{el.value}₽</b>
                        </div> 
                    )}
            </div>

            <p>Вы можете поддержать сохранение культурного наследия России и великого учёного - Е.Н. Понасенкова</p>

            <div className='items little'>
                <ImageLook onClick={() => onView(ARCHITECTURE_FOUNDATION_URL)} src={ARCHITECTURE_FOUNDATION_ICON} min={2} max={2} className='icon' alt='icon' />
                <ImageLook onClick={() => onView(HISTORIAN_URL)} src={HISTORIAN_ICON} min={2} max={2} className='icon' alt='icon' />
            </div>
            
            <h4 className='pale'>Благотворительность: <b>{value}</b>₽</h4>
            <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
        </>
    )
}

export default About