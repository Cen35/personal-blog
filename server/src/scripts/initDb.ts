import { env } from '../config/env.js'
import { initializeStore } from '../services/store.js'

if (env.DATABASE_DRIVER !== 'mysql') {
  console.log('Set DATABASE_DRIVER=mysql in server/.env before initializing MySQL.')
  process.exit(0)
}
await initializeStore()
console.log('MySQL tables and default categories are ready.')

