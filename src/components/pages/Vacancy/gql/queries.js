import {gql} from '@apollo/client'

export const getVacanciesQ = gql`
    query {
        getVacancies {
            shortid
            name
            title
            category
            stage
            url
            experience
            salary
            region
            cords {
                lat
                long
            }
            candidate
            msg
            rates
            polls {
                shortid
                name
                text
                category
                reply
            }
            photos {
                shortid
                title
                format
                image
                dateUp
                likes
            }
        }
    }
`