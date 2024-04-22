import {gql} from '@apollo/client'

export const getMaterialsQ = gql`
    query {
        getMaterials {
            shortid
            name
            title
            category
            level
            articles
            words
            dateUp
            rating
            screen
            resources {
                shortid
                name
                title
                category
                language
                url
                likes
            }
            questions {
                shortid
                name
                text
                level
                answer
                dateUp
            }
        }
    }
`