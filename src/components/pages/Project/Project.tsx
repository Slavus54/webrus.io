import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updatePages} from '../../../utils/storage'
import Loading from '../../../shared/UI/Loading'
import DataPagination from '../../../shared/UI/DataPagination'
import CounterView from '../../../shared/UI/CounterView'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import {getProjectM, manageProjectStatusM, updateProjectIdeaM, updateProjectProgressM, manageProjectTaskM, manageProjectTechnologyM} from './gql/mutations'
import {PROJECT_ROLES, TASK_TYPES, TECHNOLOGY_TYPES, PERIODS, MAX_LINES, LINES_PART} from './env'
import {LEVELS} from '../../../env/env'
import {CollectionPropsType, ContextType} from '../../../env/types'

const Project: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)

    const [members, setMembers] = useState<any[]>([])
    const [personality, setPersonality] = useState<any | null>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [task, setTask] = useState<any | null>(null)
    const [technologies, setTechnologies] = useState<any[]>([])
    const [technology, setTechnology] = useState<any | null>(null)
    const [project, setProject] = useState<any | null>(null)

    const [image, setImage] = useState<string>('')
    const [idea, setIdea] = useState<string>('')
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [lines, setLines] = useState<number>(MAX_LINES / 2)
    const [progress, setProgress] = useState<number>(0)

    const [state, setState] = useState({
        role: PROJECT_ROLES[0],
        text: '',
        direction: TASK_TYPES[0],
        level: LEVELS[0],
        done: false,
        dateUp: datus.timestamp('date'),
        title: '',
        category: TECHNOLOGY_TYPES[0],
        period: PERIODS[0]
    })

    const {role, text, direction, level, done, dateUp, title, category, period} = state

    const [getProject] = useMutation(getProjectM, {
        onCompleted(data) {
            setProject(data.getProject)
        }
    })

    const [manageProjectStatus] = useMutation(manageProjectStatusM, {
        onCompleted(data) {
            buildNotification(data.manageProjectStatus)
        }
    })

    const [updateProjectIdea] = useMutation(updateProjectIdeaM, {
        onCompleted(data) {
            buildNotification(data.updateProjectIdea)
        }
    })
    
    const [updateProjectProgress] = useMutation(updateProjectProgressM, {
        onCompleted(data) {
            buildNotification(data.updateProjectProgress)
        }
    })

    const [manageProjectTask] = useMutation(manageProjectTaskM, {
        onCompleted(data) {
            buildNotification(data.manageProjectTask)
        }
    })

    const [manageProjectTechnology] = useMutation(manageProjectTechnologyM, {
        onCompleted(data) {
            buildNotification(data.manageProjectTechnology)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Project')
    
        if (account.shortid !== '') {
            getProject({
                variables: {
                    id
                }
            })
        }

    }, [account])

    useMemo(() => {
        if (project !== null) {
            setIsAuthor(account.name === project.name)

            setIdea(project.idea)
            setProgress(project.progress)

            updatePages(project.title, 'project', window.location.pathname, datus.timestamp())
        }
    }, [project])

    useMemo(() => {
        if (project !== null && !isAuthor) {
            let result = project.members.find(el => centum.search(el.shortid, account.shortid, 100))

            if (result !== undefined) {
                setPersonality(result)
            }
        }
    }, [project, isAuthor])

    useMemo(() => {
        if (personality !== null) {
            setState({...state, role: personality.role})
        }
    }, [personality])

    const onView = (tag: string) => {
        centum.go(tag, 'telegram')
    }

    const onManageStatus = (option: string) => {
        manageProjectStatus({
            variables: {
                name: account.name, id, option, role
            }
        })
    }

    const onUpdateIdea = () => {
        updateProjectIdea({
            variables: {
                name: account.name, id, idea
            }
        })
    }

    const onUpdateProgress = () => {
        updateProjectProgress({
            variables: {
                name: account.name, id, progress
            }
        })
    }

    const onManageTask = (option: string) => {
        manageProjectTask({
            variables: {
                name: account.name, id, option, text, direction, level, done: task !== null, image, dateUp, coll_id: task !== null ? '' : task.shortid
            }
        })
    }

    const onManageTechnology = (option: string) => {
        manageProjectTechnology({
            variables: {
                name: account.name, id, option, title, category, period, lines, likes: Number(technology !== null) , coll_id: technology !== null ? '' : task.shortid
            }
        })
    }

    return (
        <div className='main profile'>
            {project !== null && 
                <>
                    <h2>{project.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Тип: {project.category}</h4>
                        <h4 className='pale'>Язык: {project.language}</h4>
                    </div>
                </>
            }

            {project !== null && personality === null &&
                <>
                    <h4 className='pale'>Добро пожаловать, {role}!</h4>

                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {PROJECT_ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('join')}>Присоединиться</button>
                </>
            }

            {project !== null && personality !== null && isAuthor &&
                <>
                    <h2>Новая Задача</h2>
                    
                    <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Сформулируйте вашу проблему...' />

                    <div className='items small'>
                        {TASK_TYPES.map(el => <div onClick={() => setState({...state, direction: el})} className={el === direction ? 'item label active' : 'item label'}>{el}</div>)}
                    </div>

                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <ImageLoader setImage={setImage} />

                    <button onClick={() => onManageTask('create')}>Опубликовать</button>

                    <h4 className='pale'>Прогресс: <b>{progress}%</b></h4>
                    <input value={progress} onChange={e => setProgress(parseInt(e.target.value))} type='range' step={1} />

                    <button onClick={onUpdateProgress} className='light'>Обновить</button>
                </> 
            }

            {project !== null && personality !== null && !isAuthor &&
                <>
                    <h2>Идея для проекта</h2>

                    <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder='Текст...' />

                    <button onClick={onUpdateIdea} className='light'>Обновить</button>

                    <h2>Моя роль</h2>

                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {PROJECT_ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <div className='items little'>
                        <button onClick={() => onManageStatus('exit')}>Выйти</button>
                        <button onClick={() => onManageStatus('update')}>Обновить</button>
                    </div>
                </>
            }

            {project !== null && personality !== null && 
                <>
                    {task === null ? 
                            <>
                                <DataPagination items={project.tasks} setItems={setTasks} label='Актуальные задачи:' />
                                <div className='items half'>
                                    {tasks.map(el => 
                                        <div onClick={() => setTask(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTask(null)} />

                                {task.image !== '' && <ImageLook src={task.image} className='photo' alt='task photo' />}

                                <h2>Новая задача от {project.name}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {task.direction}</h4>
                                    <h4 className='pale'>Уровень сложности: {task.level}</h4>
                                </div>

                                <p>Формулировка: {task.text}</p>

                                <h4>Статус: {task.done ? 'Выполнено' : 'В процессе'}</h4>

                                {isAuthor ? 
                                        <button onClick={() => onManageTask('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageTask('done')}>Сделано</button>
                                }
                            </>
                    }

                    {technology === null ? 
                            <>
                                <h2>Новая Технология</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название' type='text' />

                                <div className='items small'>
                                    {TECHNOLOGY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Обьём и период использования</h4>

                                <CounterView num={lines} setNum={setLines} part={LINES_PART} min={0} max={MAX_LINES}>
                                    Строк кода: {lines}
                                </CounterView>

                                <select value={period} onChange={e => setState({...state, period: e.target.value})}>
                                    {PERIODS.map(el => <option value={el}>{el}</option>)}
                                </select>
                                
                                <button onClick={() => onManageTechnology('create')}>Предложить</button>

                                <DataPagination items={project.technologies} setItems={setTechnologies} label='Стек технологий:' />
                                <div className='items half'>
                                    {technologies.map(el => 
                                        <div onClick={() => setTechnology(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.category}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTechnology(null)} />

                                <h2>{technology.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {technology.category}</h4>
                                    <h4 className='pale'>Опыт: {technology.period} ({technology.lines} строк)</h4>
                                </div>

                                <p><b>{technology.likes}</b> лайков</p>

                                {account.name === technology.name ? 
                                        <button onClick={() => onManageTechnology('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageTechnology('like')}>Нравится</button>
                                }
                            </>
                    }

                    <DataPagination items={project.members} setItems={setMembers} label='Участники проекта:' />
                    <div className='items half'>
                        {members.map(el => 
                            <div onClick={() => onView(el.telegram)} className='item panel'>
                                {centum.shorter(el.name)}
                                <p className='pale'>{el.role}</p>
                            </div>
                        )}
                    </div>
                </>
            }           

            {project === null && <Loading label='Загрузка проекта' />}
        </div>
    )
}

export default Project