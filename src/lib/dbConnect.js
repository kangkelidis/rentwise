import mongoose from 'mongoose'

let cached = global.mongoose

async function dbConnect() {
	const MONGODB_URI = process.env.DB_URI || process.env.MONGODB_URI

	if (!MONGODB_URI) {
		throw new Error(
			'Please define DB_URI (or MONGODB_URI) in your environment variables'
		)
	}

	if (!cached) {
		cached = global.mongoose = { conn: null, promise: null }
	}

	// In serverless environments, a cached mongoose instance can survive while
	// the underlying socket is already closed. Only reuse an active connection.
	if (cached.conn && cached.conn.connection?.readyState === 1) {
		return cached.conn
	}

	if (cached.conn && cached.conn.connection?.readyState !== 1) {
		cached.conn = null
		cached.promise = null
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			serverSelectionTimeoutMS: 10000,
			maxPoolSize: 10,
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
