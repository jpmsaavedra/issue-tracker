
import test from 'ava'
import Issues from '../modules/issues.js'
import Accounts from '../modules/accounts.js'

test('SUBMIT     : submit a valid issue', async test => {
	test.plan(1)
	const issue = await new Issues() // no database specified so runs in-memory
	const user = await new Accounts()
	try {
		await user.testSetup()
		/**await user.register('test123', 'password', 'test@gmail.com')**/
		const submit = await issue.submit('test name', 'test location', 'Lorem ipsum dolor sit amet, \
			consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
			Aenean mana', '/test/path', 'bloggsj')
		test.is(submit, true, 'unable to submit issue')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		issue.close()
		user.close()
	}
})
