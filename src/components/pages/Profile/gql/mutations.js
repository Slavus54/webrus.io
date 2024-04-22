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