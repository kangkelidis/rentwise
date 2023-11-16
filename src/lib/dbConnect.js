import mongoose from 'mongoose'
import { currentUser } from '@clerk/nextjs'

let cached = global.mongoose

async function dbConnect() {

	const user = await currentUser()
  
	const MONGODB_URI =
		user?.username === 'demo' ? process.env.DB_URI_DEMO : process.env.DB_URI

	if (!MONGODB_URI) {
		throw new Error('Please define the MONGODB_URI environment variable')
	}

	if (!cached) {
		cached = global.mongoose = { conn: null, promise: null }
	}

	if (cached.conn) {
		return cached.conn
	}
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: user?.username === 'demo' ? 'demo' : 'test',
		}
		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose
		})
	}
	try {
		cached.conn = await cached.promise
	} catch (e) {
		cached.promise = null
		throw e
	}
	return cached.conn
}


export default dbConnect
