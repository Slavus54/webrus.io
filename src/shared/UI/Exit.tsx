import {useContext} from 'react'
import ImageLook from '../UI/ImageLook'
import {AppContext} from '../../context/AppContext'
import ExitImage from '../../assets/exit.png'
import {ContextType} from '../../env/types'

const Exit = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)

    const onExit = () => {
        accountUpdate('update', null, 1)
        window.location.reload()
    }

    return <ImageLook onClick={onExit} src={ExitImage} min={2} max={2.2} className='exit icon' alt='exit' />
}

export default Exit