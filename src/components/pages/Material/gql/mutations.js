import {gql} from '@apollo/client'

export const createMaterialM = gql`
    mutation createMaterial($name: String!, $id: String!, $title: String!, $category: String!, $level: String!, $articles: [String]!, $words: Float!, $dateUp: String!, $rating: Float!, $screen: String!) {
        createMaterial(name: $name, id: $id, title: $title, category: $category, level: $level, articles: $articles, words: $words, dateUp: $dateUp, rating: $rating, screen: $screen)
    }
`

export const getMaterialM = gql`
    mutation getMaterial($id: String!) {
        getMaterial(id: $id) {
            shortid
            name
            title
            category
            level
            articles
            words
            dateUp
            rating
            screen
            resources {
                shortid
                name
                title
                category
                language
                url
                likes
            }
            questions {
                shortid
                name
                text
                level
                answer
                dateUp
            }
        }
    }
`

export const manageMaterialResourceM = gql`
    mutation manageMaterialResource($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $language: String!, $url: String!, $likes: Float!, $coll_id: String!) {
        manageMaterialResource(name: $name, id: $id, option: $option, title: $title, category: $category, language: $language, url: $url, likes: $likes, coll_id: $coll_id)
    }
`

export const updateMaterialRatingM = gql`
    mutation updateMaterialRating($name: String!, $id: String!, $rating: Float!) {
        updateMaterialRating(name: $name, id: $id, rating: $rating)
    }
`

export const updateMaterialScreenM = gql`
    mutation updateMaterialScreen($name: String!, $id: String!, $screen: String!) {
        updateMaterialScreen(name: $name, id: $id, screen: $screen)
    }
`

export const publishMaterialQuestionM = gql`
    mutation publishMaterialQuestion($name: String!, $id: String!, $text: String!, $level: String!, $answer: String!, $dateUp: String!) {
        publishMaterialQuestion(name: $name, id: $id, text: $text, level: $level, answer: $answer, dateUp: $dateUp)
    }
`