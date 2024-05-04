import {gql} from '@apollo/client'

export const getOrganizationsQ = gql`
    query {
        getOrganizations {
            shortid
            name
            title
            category
            format
            region
            cords {
                lat
                long
            }
            url
            product
            rating
            services {
                shortid
                name
                text
                format
                level
                dateUp
            }
            features {
                shortid
                name
                title
                category
                status
                image
                likes
            }
        }
    }
`