import {gql} from '@apollo/client'

export const createAssemblyM = gql`
    mutation createAssembly($name: String!, $id: String!, $title: String!, $category: String!, $language: String!, $region: String!, $cords: ICord!, $dateUp: String!, $time: String!, $url: String!, $rating: Float!, $position: String!, $points: Float!) {
        createAssembly(name: $name, id: $id, title: $title, category: $category, language: $language, region: $region, cords: $cords, dateUp: $dateUp, time: $time, url: $url, rating: $rating, position: $position, points: $points) 
    }
`

export const getAssemblyM = gql`
    mutation getAssembly($shortid: String!) {
        getAssembly(shortid: $shortid) {
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

export const manageAssemblyStatusM = gql`
    mutation manageAssemblyStatus($name: String!, $id: String!, $option: String!, $position: String!) {
        manageAssemblyStatus(name: $name, id: $id, option: $option, position: $position)
    }
`

export const updateAssemblyInformationM = gql`
    mutation updateAssemblyInformation($name: String!, $id: String!, $url: String!, $rating: Float!) {
        updateAssemblyInformation(name: $name, id: $id, url: $url, rating: $rating)
    }
`

export const manageAssemblyLocationM = gql`
    mutation manageAssemblyLocation($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $cords: ICord!, $likes: Float!, $coll_id: String!) {
        manageAssemblyLocation(name: $name, id: $id, option: $option, title: $title, category: $category, image: $image, cords: $cords, likes: $likes, coll_id: $coll_id)
    }
`