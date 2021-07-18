
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
				(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, \
                locationDesc TEXT, detailedDesc TEXT, date DEFAULT CURRENT_TIMESTAMP, \
                status TEXT, photo TEXT, reporter INTEGER, FOREIGN KEY(reporter) REFERENCES user(id));'
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
	async submit(name, locationDesc, detailedDesc, photo, user) {
		let sql = `SELECT id AS id FROM users WHERE user="${user}";`
		const record = await this.db.get(sql)
		const reporter = record.id
		const status = 'new'
		if(!name) throw new Error('issue must have a name')
		if(!locationDesc) throw new Error('issue must have a location description')
		const minChar = 100
		if(detailedDesc.length < minChar) throw new Error('issue description must be longer than 100 characters')
		sql = `INSERT INTO issues(name, location_desc, detailed_desc, status, photo, reporter) VALUES("${name}", \
            "${locationDesc}", "${detailedDesc}", "${status}", "${photo}", "${reporter}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * gets issues from database
	 * @returns {Object} allIssues issues information from database
	 */
	async getIssues() {
		let sql = 'SELECT count(id) AS count FROM issues;'
		const records = await this.db.get(sql)
		if(!records.count) throw new Error('no issues found')
		sql = 'SELECT * FROM issues;'
		const allIssues = await this.db.get(sql)
		return allIssues
	}

	async close() {
		await this.db.close()
	}
}

export default Issues
