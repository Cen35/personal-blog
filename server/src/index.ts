import { app } from './app.js'
import { env } from './config/env.js'
import { initializeStore } from './services/store.js'

await initializeStore()
app.listen(env.PORT, () => {
  console.log(`PERSONAL BLOG API is running at http://localhost:${env.PORT}`)
  console.log(`Database driver: ${env.DATABASE_DRIVER}`)
})

