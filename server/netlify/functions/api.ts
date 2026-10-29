import serverless from 'serverless-http'
import { app } from '../../src/app.js'
import { initializeStore } from '../../src/services/store.js'

const expressHandler = serverless(app)

export const handler = async (event: any, context: any) => {
  await initializeStore()
  const apiEvent = {
    ...event,
    path: event.path?.replace('/.netlify/functions/api', '/api'),
    rawUrl: event.rawUrl?.replace('/.netlify/functions/api', '/api'),
  }
  return expressHandler(apiEvent, context)
}
