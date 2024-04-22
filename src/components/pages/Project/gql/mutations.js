import {gql} from '@apollo/client'

export const createProjectM = gql`
    mutation createProject($name: String!, $id: String!, $title: String!, $description: String!, $category: String!, $language: String!, $url: String!, $idea: String!, $progress: Float!, $role: String!) {
        createProject(name: $name, id: $id, title: $title, description: $description, category: $category, language: $language, url: $url, idea: $idea, progress: $progress, role: $role)
    }
`

export const getProjectM = gql`
    mutation getProject($shortid: String!) {
        getProject(shortid: $shortid) {
            shortid
            name
            title
            description
            category
            language
            url
            idea
            progress
            members {
                shortid
                name
                telegram
                role
            }
            tasks {
                shortid
                text
                direction
                level
                done
                image
                dateUp
            }
            technologies {
                shortid
                name
                title
                category
                period
                lines
                likes
            }
        }
    }
`

export const manageProjectStatusM = gql`
    mutation manageProjectStatus($name: String!, $id: String!, $option: String!, $role: String!) {
        manageProjectStatus(name: $name, id: $id, option: $option, role: $role)
    }
`

export const updateProjectIdeaM = gql`
    mutation updateProjectIdea($name: String!, $id: String!, $idea: String!) {
        updateProjectIdea(name: $name, id: $id, idea: $idea)
    }
`

export const updateProjectProgressM = gql`
    mutation updateProjectProgress($name: String!, $id: String!, $progress: Float!) {
        updateProjectProgress(name: $name, id: $id, progress: $progress)
    }
`

export const manageProjectTaskM = gql`
    mutation manageProjectTask($name: String!, $id: String!, $option: String!, $text: String!, $direction: String!, $level: String!, $done: Boolean!, $image: String!, $dateUp: String!, $coll_id: String!) {
        manageProjectTask(name: $name, id: $id, option: $option, text: $text, direction: $direction, level: $level, done: $done, image: $image, dateUp: $dateUp, coll_id: $coll_id)
    }
`

export const manageProjectTechnologyM = gql`
    mutation manageProjectTechnology($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $period: String!, $lines: Float!, $likes: Float!, $coll_id: String!) {
        manageProjectTechnology(name: $name, id: $id, option: $option, title: $title, category: $category, period: $period, lines: $lines, likes: $likes, coll_id: $coll_id)
    }
`