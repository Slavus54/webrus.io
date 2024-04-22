import React from 'react'

// Context API

export interface UserCookieType {
    shortid: string
    name: string
    points: number
}

export type AccountCookieType = Omit<UserCookieType, 'name' | 'points'> 

export interface ContextType {
    account: any 
    accountUpdate: any
} 

export type ContextPropsType = {
    children: React.ReactNode
}

// Routing

export enum RouteStatuses {
    StrangerOnly = 0,
    Allowed = 1,
    RegisteredOnly = 2
}

export interface RouteItem {
    title: string
    url: string
    component: any
    status: RouteStatuses
    visible: boolean
}

export interface RouterNavigatorPropsType {
    url: string
    children: any
}

export interface CollectionPropsType {
    params: {
        id: string
    }
}

// Account

export interface AccountPart {
    title: string
    url: string
    component: any
}

export interface AccountPropsType {
    profile: any
}

export interface AccountCollectionType {
    shortid: string
    title: string
    path: string
}

export interface AccountComponentType {
    title: string
    url: string
}

// API

export interface TownType {
    title: string
    translation: string
    cords: Cords
}

export interface ChannelType {
    title: string
    icon: string
    url: string
}

// Mapbox 

export interface MapType {
    latitude: number
    longitude: number
    width: string
    height: string
    zoom: number
}

export interface Cords {
    lat: number
    long: number
}

// UI

export interface SimpleTriggerProps {
    onClick: any
}

export interface CounterViewProps {
    num: number
    setNum: any 
    part?: number
    min?: number
    max?: number
    children: any
    selector?: string
}

export interface DataPaginationProps {
    items?: any[]
    setItems: any
    label?: string
}

export interface FormPaginationProps {
    children: any
    items: any[]
}

export interface ImageLoaderProps {
    setImage: any
    label?: string
}

export interface ImageLookProps {
    src: string
    min?: number
    max?: number
    speed?: number 
    className?: string
    onClick?: any
    alt?: string
}

export interface LoadingPropsType {
    label: string
}