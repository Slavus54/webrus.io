import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import {createHttpLink} from 'apollo-link-http'
import {RecoilRoot} from 'recoil'
import AppProvider from './context/AppContext'
import {APP_NODE, WEBSERVER_URL} from './env/env'

//@ts-ignore

const link = new createHttpLink({
  uri: WEBSERVER_URL
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById(APP_NODE) as HTMLElement
)

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </AppProvider>
    </ApolloProvider>
  </React.StrictMode>
)

reportWebVitals()

if ('serviceWorker' in navigator) {
  window.navigator.serviceWorker.register('./sw/serviceWorker.js')
}