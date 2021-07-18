
import test from 'ava'
import Issues from '../modules/issues.js'

test('SUBMIT     : submit a valid issue', async test => {
	test.plan(1)
	const issue = await new Issues() // no database specified so runs in-memory
	try {
		const submit = await issue.submit('test name', 'test location', 'Lorem ipsum dolor sit amet, \
			consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
			Aenean mana', '/test/path', 'test')
		test.is(submit, true, 'unable to submit issue')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		issue.close()
	}
})

test('SUBMIT     : error if blank name', async test => {
	test.plan(1)
	const issue = await new Issues() // no database specified so runs in-memory
	try {
		await issue.submit('', 'test location', 'Lorem ipsum dolor sit amet, \
			consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
			Aenean mana', '/test/path', 'test')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'issue must have a name', 'incorrect error message')
	} finally {
		issue.close()
	}
})

test('SUBMIT     : error if blank location description', async test => {
	test.plan(1)
	const issue = await new Issues() // no database specified so runs in-memory
	try {
		await issue.submit('test', '', 'Lorem ipsum dolor sit amet, \
			consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
			Aenean mana', '/test/path', 'test')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'issue must have a location description', 'incorrect error message')
	} finally {
		issue.close()
	}
})

test('SUBMIT     : error if detailed description less than 100 characters', async test => {
	test.plan(1)
	const issue = await new Issues() // no database specified so runs in-memory
	try {
		await issue.submit('test', 'test location', '', '/test/path', 'test')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'issue description must be longer than 100 characters', 'incorrect error message')
	} finally {
		issue.close()
	}
})

test('GET ISSUES : no error getting issues', async test => {
	test.plan(1)
	const issue = await new Issues() // no database specified so runs in-memory
	try {
		await issue.submit('test name', 'test location', 'Lorem ipsum dolor sit amet, \
			consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
			Aenean mana', '/test/path', 'test')
		const get = issue.getIssues()
		test.truthy(get, 'unable to get issues')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		issue.close()
	}
})

test('GET ISSUES : error if no issues on database', async test => {
	test.plan(1)
	const issue = await new Issues()
	try {
		await issue.getIssues()
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no issues found. create the first one!', 'incorrect error message')
	} finally {
		issue.close()
	}
})

