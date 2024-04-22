import {gql} from '@apollo/client'

export const getProjectsQ = gql`
    query {
        getProjects {
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