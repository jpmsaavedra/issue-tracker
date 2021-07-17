
/** @module Issues */

import sqlite from 'sqlite-async'

/**
 * Accounts
 * ES6 module that handles submiting new issues.
 */
class Issues {
	/**
   * Create an issue object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the issues
			const sql = 'CREATE TABLE IF NOT EXISTS issues\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location_desc TEXT, detailed_desc TEXT, date DEFAULT CURRENT_TIMESTAMP, status TEXT, photo TEXT, reporter INTEGER, FOREIGN KEY(reporter) REFERENCES user(id));'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * submits a new user
	 * @param {String} name the chosen issue name
	 * @param {String} location_desc the chosen issue location description
	 * @param {String} detailed_desc the chosen issue detailed description
	 * @param {String} photo the path of the issue picture
	 * @param {String} user the id of the user who submitted the issue
	 */
	async submit(name, location_desc, detailed_desc, photo, user) {        
        let sql = `SELECT id AS id FROM users WHERE user="${user}";`
        const record = await this.db.get(sql)
        const reporter = record.id
        const status = 'new';
        sql = `INSERT INTO issues(name, location_desc, detailed_desc, status, photo, reporter) VALUES("${name}", "${location_desc}", "${detailed_desc}", "${status}", "${photo}", "${reporter}")`
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export default Issues