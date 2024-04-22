import {gql} from '@apollo/client'

export const getProfileM = gql`
    mutation getProfile($id: String!) {
        getProfile(id: $id) {
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

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($id: String!, $image: String!) {
        updateProfilePersonalInfo(id: $id, image: $image)
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(id: $id, region: $region, cords: $cords)
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($id: String!, $current_password: String!, $new_password: String!) {
        updateProfilePassword(id: $id, current_password: $current_password, new_password: $new_password)
    }
`

export const manageProfileAchievementM = gql`
    mutation manageProfileAchievement($id: String!, $option: String!, $text: String!, $category: String!, $language: String!, $url: String!, $image: String!, $rating: Float!, $dateUp: String!, $coll_id: String!) {
        manageProfileAchievement(id: $id, option: $option, text: $text, category: $category, language: $language, url: $url, image: $image, rating: $rating, dateUp: $dateUp, coll_id: $coll_id)
    }
`

export const manageProfileCareerM = gql`
    mutation manageProfileCareer($id: String!, $option: String!, $title: String!, $direction: String!, $format: String!, $experience: Float!, $salary: Float!, $image: String!, $respects: Float!, $coll_id: String!) {
        manageProfileCareer(id: $id, option: $option, title: $title, direction: $direction, format: $format, experience: $experience, salary: $salary, image: $image, respects: $respects, coll_id: $coll_id)
    }
`