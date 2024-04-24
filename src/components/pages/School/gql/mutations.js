import {gql} from '@apollo/client'

export const createSchoolM = gql`
    mutation createSchool($name: String!, $id: String!, $title: String!, $category: String!, $region: String!, $cords: ICord!, $subject: String!, $rating: Float!, $image: String!) {
        createSchool(name: $name, id: $id, title: $title, category: $category, region: $region, cords: $cords, subject: $subject, rating: $rating, image: $image)
    }
`

export const getSchoolM = gql`
    mutation getSchool ($id: String!) {
        getSchool(id: $id) {
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

export const publishSchoolFactM = gql`
    mutation publishSchoolFact($name: String!, $id: String!, $text: String!, $level: String!, $isTrue: Boolean!, $dateUp: String!) {
        publishSchoolFact(name: $name, id: $id, text: $text, level: $level, isTrue: $isTrue, dateUp: $dateUp)
    }
`

export const updateSchoolInformationM = gql`
    mutation updateSchoolInformation($name: String!, $id: String!, $subject: String!, $rating: Float!, $image: String!) {
        updateSchoolInformation(name: $name, id: $id, subject: $subject, rating: $rating, image: $image)
    }
`

export const manageSchoolPersonM = gql`
    mutation manageSchoolPerson($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $status: String!, $likes: Float!, $coll_id: String!) {
        manageSchoolPerson(name: $name, id: $id, option: $option, title: $title, category: $category, status: $status, likes: $likes, coll_id: $coll_id)
    }
`