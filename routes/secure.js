
import Router from 'koa-router'

const router = new Router({ prefix: '/secure' })

import Accounts from '../modules/accounts.js'
import Issues from '../modules/issues.js'
const dbName = 'website.db'


async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)


router.get('/', async ctx => {
	try {
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/submit', async ctx => {
    try {
		await ctx.render('submit', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})


router.post('/submit', async ctx => {
	const issue = await new Issues(dbName)
    console.log(ctx.request.body)
    ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
        const user = ctx.session.user
		await issue.submit(body.name, body.location_desc, body.detailed_desc, body.photo, user)
		const referrer = body.referrer || '/secure'
        return ctx.redirect(`${referrer}?msg=issue has been created...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await issue.close()
	}
})

export default router
