import { PrismaDatabaseService } from './prisma-db'

// Re-export PrismaDatabaseService as DatabaseService for compatibility
export { PrismaDatabaseService as DatabaseService }

// Export the database service as default
export { PrismaDatabaseService as default }