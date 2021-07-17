
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
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @param {String} email the chosen email
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async submit(name, location_desc, detailed_desc, photo, user) {        
        let sql = `SELECT id AS id FROM users WHERE user="${user}";`
        const record = await this.db.get(sql)
        const reporter = record.id
        let status = 'new';
        photo = "test";
        sql = `INSERT INTO issues(name, location_desc, detailed_desc, status, photo, reporter) VALUES("${name}", "${location_desc}", "${detailed_desc}", "${status}", "${photo}", "${reporter}")`
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export default Issues