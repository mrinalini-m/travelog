const { Pool } = require('pg')
const { connectionString } = require('../config/DO_NOT_COMMIT.env.vars')

const handleError = err => new Error(err)

const pool = new Pool({
	connectionString
})

pool.on('connect', () => {
	console.log('connected to the db')
})

/**
 * Create Image Table
 */
const createImageTable = async () => {
	const queryText = `CREATE TABLE IF NOT EXISTS
		images(
			image_id SERIAL PRIMARY KEY,
			user_id integer REFERENCES users (user_id) NOT NULL,
			exif JSON,
			key varchar(150) NOT NULL UNIQUE
		);`

	const res = await pool.query(queryText).catch(handleError)

	return res
}

/**
 * Create User Table
 */
const createUserTable = async () => {
	const queryText = `CREATE TABLE IF NOT EXISTS
		users(
			user_id SERIAL PRIMARY KEY,
			username VARCHAR(80) NOT NULL UNIQUE
		);`

	const res = await pool.query(queryText).catch(handleError)
	return res
}

/**
 * Create All Tables
 */
const createAllTables = async () => {
	const users = await createUserTable()
	let images

	if (!(users instanceof Error)) {
		images = await createImageTable()
	} else {
		console.error(users)
		return
	}

	if (images instanceof Error) {
		console.error(images)
		return
	}
	pool.end()
}

createAllTables()
