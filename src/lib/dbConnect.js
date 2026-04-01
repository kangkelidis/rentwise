import mongoose from 'mongoose'
import { currentUser } from '@clerk/nextjs'

let cached = global.mongoose

async function dbConnect() {
	let user = null
	try {
		user = await currentUser()
	} catch (error) {
		// If Clerk context is unavailable, fall back to the default DB URI.
		user = null
	}

	const defaultUri = process.env.DB_URI || process.env.MONGODB_URI
	const demoUri = process.env.DB_URI_DEMO || defaultUri
	const MONGODB_URI = user?.username === 'demo' ? demoUri : defaultUri

	if (!MONGODB_URI) {
		throw new Error(
			'Please define DB_URI (or MONGODB_URI) in your environment variables'
		)
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
