import React, {useState, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {getProfileInfo, updateProfileInfo} from '../../utils/storage'
import {changeTitle} from '../../utils/notifications'
import AccountSidebar from '../pages/Account/AccountSidebar'
import Exit from '../../shared/UI/Exit'
import {getProfileM} from '../pages/Account/gql/mutations'
import {AccountCookieType} from '../../env/types'

const Account: React.FC<AccountCookieType> = ({shortid}) => {
    const [profile, setProfile] = useState(null)

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            updateProfileInfo(data.getProfile)
        }
    })

    useLayoutEffect(() => {
        let data = getProfileInfo()

        changeTitle('Account')
       
        if (data !== null) {
            setProfile(data)
        } else {
            getProfile({
                variables: {
                    id: shortid
                }
            })
        }
    }, [])
    
    return (
        <>
            <AccountSidebar profile={profile} />
            <Exit />
        </>
    )
}

export default Account