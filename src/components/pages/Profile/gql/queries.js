import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            shortid
            name
            password
            telegram
            region
            cords {
                lat
                long
            }
            image
            points 
            achievements {
                shortid 
                text
                category
                language
                url
                image
                rating
                dateUp
            }
            careers {
                shortid
                title
                direction
                format
                experience
                salary
                image
                respects
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`