import {gql} from '@apollo/client'

export const createOrganizationM = gql`
    mutation createOrganization($name: String!, $id: String!, $title: String!, $category: String!, $format: String!, $region: String!, $cords: ICord!, $url: String!, $product: String!, $rating: Float!) {
        createOrganization(name: $name, id: $id, title: $title, category: $category, format: $format, region: $region, cords: $cords, url: $url, product: $product, rating: $rating)
    }
`

export const getOrganizationM = gql`
    mutation getOrganization($id: String!) {
        getOrganization(id: $id) {
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

export const makeOrganizationServiceM = gql`
    mutation makeOrganizationService($name: String!, $id: String!, $text: String!, $format: String!, $level: String!, $dateUp: String!) {
        makeOrganizationService(name: $name, id: $id, text: $text, format: $format, level: $level, dateUp: $dateUp)
    }
`

export const updateOrganizationInformationM = gql`
    mutation updateOrganizationInformation($name: String!, $id: String!, $url: String!, $product: String!, $rating: Float!) {
        updateOrganizationInformation(name: $name, id: $id, url: $url, product: $product, rating: $rating)
    }
`

export const manageOrganizationFeatureM = gql`
    mutation manageOrganizationFeature($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $status: String!, $image: String!, $likes: Float!, $coll_id: String!) {
        manageOrganizationFeature(name: $name, id: $id, option: $option, title: $title, category: $category, status: $status, image: $image, likes: $likes, coll_id: $coll_id) 
    }
`