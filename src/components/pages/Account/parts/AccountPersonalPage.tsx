import React, {useState, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import ProfilePhoto from '../../../../assets/photo/profile_photo.jpg'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfilePersonalInfoM} from '../gql/mutations'
import {AccountPropsType} from '../../../../env/types'

const AccountPersonalPage: React.FC<AccountPropsType> = ({profile}) => {
    const [image, setImage] = useState<string>('')

    useLayoutEffect(() => {
        if (profile !== null) {
            setImage(profile.image === '' ? ProfilePhoto : profile.image)
        }
    }, [profile])

    const [updateProfilePersonalInfo] = useMutation(updateProfilePersonalInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePersonalInfo)
            updateProfileInfo(null)
        }
    })

    const onUpdate = () => {
        updateProfilePersonalInfo({
            variables: {
                id: profile.shortid, image
            }
        })
    }

    return (
        <div className='main profile'>
            <ImageLook src={image} min={16} max={18} className='photo' alt='account photo' />
            <h2>{profile.name}</h2>
            <h4 className='pale'>Очков набрано: {profile.points}</h4>
      
            <ImageLoader setImage={setImage} />

            <button onClick={onUpdate}>Обновить</button>
        </div>
    )
}

export default AccountPersonalPage