import {gql} from '@apollo/client'

export const getSchoolsQ = gql`
    query {
        getSchools {
            shortid
            name
            title
            category
            region
            cords {
                lat
                long
            }
            subject
            rating
            image
            facts {
                shortid
                name
                text
                level
                isTrue
                dateUp
            }
            persons {
                shortid
                name
                title
                category
                status
                likes
            }
        }
    }
`