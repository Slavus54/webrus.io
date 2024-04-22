import {gql} from '@apollo/client'

export const getAssembliesQ = gql`
    query {
        getAssemblies {
            shortid
            name
            title
            category
            language
            region
            cords {
                lat
                long
            }
            dateUp
            time
            url
            rating
            participants {
                shortid
                name
                position
            }
            locations {
                shortid
                name
                title
                category
                image
                cords {
                    lat
                    long
                }
                likes
            }
        }
    }
`