import React, {useLayoutEffect} from 'react'
import {centum} from '../../shared/libs/libs'
import {changeTitle} from '../../utils/notifications'
import RouterNavigator from '../router/RouterNavigator'
import ImageLook from '../../shared/UI/ImageLook'
import features from '../../env/features.json'
import {channels} from '../../env/channels'

const Welcome: React.FC = () => {

    useLayoutEffect(() => {
        changeTitle('Welcome')
    }, [])

    return (
        <>
            <h2>WEBRUS.IO</h2>

            <div className='items half'>
                {features.map(el  => 
                    <div className='item panel'>
                        {el.title}
                        <h5 className='pale'>{el.text}</h5>
                    </div>
                )}
            </div>

            <div className='items small'>
                <RouterNavigator url='/login'>
                    <button>Вход</button>
                </RouterNavigator>
                <RouterNavigator url='/register'>
                    <button>Регистрация</button>
                </RouterNavigator>
            </div>
           
           <h2>Благодарность IT сообществу на YouTube</h2>
           <div className='items half'>
                {channels.map(el => 
                    <div onClick={() => centum.go(el.url)} className='item card'>
                        <ImageLook src={el.icon} min={2} max={2} className='icon' alt='icon' />
                        <p className='small-text'>{el.title}</p>
                    </div>
                )}
           </div>
        </>
    )
}

export default Welcome