
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
                status TEXT, photo TEXT, reporter INTEGER);'
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
	 * @param {String} user the name of the user who submitted the issue
	 */
	async submit(name, locationDesc, detailedDesc, photo, user) {
		const status = 'new'
		if(!name) throw new Error('issue must have a name')
		if(!locationDesc) throw new Error('issue must have a location description')
		const minChar = 100
		if(detailedDesc.length < minChar) throw new Error('issue description must be longer than 100 characters')
		const sql = `INSERT INTO issues(name, locationDesc, detailedDesc, status, photo, reporter) VALUES("${name}", \
            "${locationDesc}", "${detailedDesc}", "${status}", "${photo}", "${user}")`
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
		if(!records.count) throw new Error('no issues found. create the first one!')
		sql = 'SELECT * FROM issues;'
		const allIssues = await this.db.all(sql)
		for(let i = 0; i < allIssues.length; i++) {
			const oldDate = allIssues[i].date
			const options = {year: 'numeric', month: 'numeric', day: 'numeric'}
			const newDate = new Date(oldDate).toLocaleDateString('en-GB', options)
			allIssues[i].date = newDate
		}
		return allIssues
	}

	async close() {
		await this.db.close()
	}
}

export default Issues
