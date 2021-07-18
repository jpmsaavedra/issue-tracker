
import Router from 'koa-router'

const router = new Router({ prefix: '/secure' })

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
	const issue = await new Issues(dbName)
	try {
		ctx.hbs.issues = await issue.getIssues()
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('submit', ctx.hbs)
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
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const user = ctx.session.user
		const pathSlicer = 29
		const path = ctx.request.files.photo.path.substr(pathSlicer)
		await issue.submit(body.name, body.locationDesc, body.detailedDesc, path, user)
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=issue has been created...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('submit', ctx.hbs)
	} finally {
		await issue.close()
	}
})

export default router
