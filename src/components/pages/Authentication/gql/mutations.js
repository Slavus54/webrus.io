import {gql} from '@apollo/client'

export const registerProfileM = gql`
    mutation registerProfile($name: String!, $password: String!, $telegram: String!, $region: String!, $cords: ICord!, $image: String!, $points: Float!) {
        registerProfile(name: $name, password: $password, telegram: $telegram, region: $region, cords: $cords, image: $image, points: $points) {
            shortid
            name
            points
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($name: String!, $password: String!) {
        loginProfile(name: $name, password: $password) {
            shortid
            name
            points
        }
    }
`