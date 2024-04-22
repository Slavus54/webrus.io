import React, {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import uniqid from 'uniqid'
import {centum} from '../../../../shared/libs/libs'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfilePasswordM} from '../gql/mutations'
import {SEARCH_PERCENT} from '../../../../env/env'
import {AccountPropsType} from '../../../../env/types'

const AccountSecurityPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [percent, setPercent] = useState<number>(SEARCH_PERCENT)

    const [state, setState] = useState({
        current_password: '', 
        new_password: ''
    })

    const {current_password, new_password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePassword)
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let size = centum.part(percent, profile.name.length, 0) 
        let result: string = uniqid().slice(0, size)

        setState({...state, new_password: result})
    }, [percent])

    const onUpdate = () => {
        updateProfilePassword({
            variables: {
                id: profile.shortid, current_password, new_password
            }
        })
    }

    return (
        <div className='main profile'>
            <h2>Безопасность</h2>
            <h4 className='pale'>Регулярно изменяйте собственный пароль</h4>

            <div className='items small'>
                <input value={current_password} onChange={e => setState({...state, current_password: e.target.value})} placeholder='Текущий пароль' type='text' />
                <input value={new_password} onChange={e => setState({...state, new_password: e.target.value})} placeholder='Новый пароль' type='text' />
            </div>

            <h4 className='pale'>Уровень защиты: <b>{percent}%</b></h4>
            <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

            <button onClick={onUpdate}>Обновить</button>
        </div>
    )
}

export default AccountSecurityPage