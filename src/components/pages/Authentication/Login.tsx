import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {Datus} from 'datus.js'
import {AppContext} from '../../../context/AppContext'
import {updateSession, getSession} from '../../../utils/storage'
import {changeTitle} from '../../../utils/notifications'
import {loginProfileM} from './gql/mutations'
import {ContextType} from '../../../env/types'

const Login: React.FC = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)

    const datus = new Datus()

    const [state, setState] = useState({
        name: getSession()?.name ?? '',
        password: ''
    })

    const {name, password} = state

    useLayoutEffect(() => {
        changeTitle('Login')
    }, [])

    const [loginProfile] = useMutation(loginProfileM, {
        onCompleted(data) {
            accountUpdate('update', data.loginProfile)
            updateSession(data.loginProfile.name, datus.timestamp('time'))
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                name, password
            }
        })
    }

    return (
        <>
            <h2>Вход в Аккаунт</h2>

            <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Имя' type='text' />
            <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль' type='text' />                   
        
            <button onClick={onLogin}>Войти</button>
        </>
    )
}

export default Login