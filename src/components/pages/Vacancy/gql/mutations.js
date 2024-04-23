import {gql} from '@apollo/client'

export const createVacancyM = gql`
    mutation createVacancy($name: String!, $id: String!, $title: String!, $category: String!, $stage: String!, $url: String!, $experience: Float!, $salary: Float!, $region: String!, $cords: ICord!, $candidate: String!, $msg: String!, $rates: Float!) {
        createVacancy(name: $name, id: $id, title: $title, category: $category, stage: $stage, url: $url, experience: $experience, salary: $salary, region: $region, cords: $cords, candidate: $candidate, msg: $msg, rates: $rates)
    }
`

export const getVacancyM = gql`
    mutation getVacancy($id: String!) {
        getVacancy(id: $id) {
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

export const updateVacancyRateM = gql`
    mutation updateVacancyRate($name: String!, $id: String!, $msg: String!, $salary: Float!, $rates: Float!) {
        updateVacancyRate(name: $name, id: $id, msg: $msg, salary: $salary, rates: $rates)
    }
`

export const manageVacancyPollM = gql`
    mutation manageVacancyPoll($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $reply: String!, $coll_id: String!) {
        manageVacancyPoll(name: $name, id: $id, option: $option, text: $text, category: $category, reply: $reply, coll_id: $coll_id)
    }
`

export const manageVacancyPhotoM = gql`
    mutation manageVacancyPhoto($name: String!, $id: String!, $option: String!, $title: String!, $format: String!, $image: String!, $dateUp: String!, $likes: Float!, $coll_id: String!) {
        manageVacancyPhoto(name: $name, id: $id, option: $option, title: $title, format: $format, image: $image, dateUp: $dateUp, likes: $likes, coll_id: $coll_id)
    }
`