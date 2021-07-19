
/* main.js */

/* global showdown, document*/

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	if(document.querySelector('aside')) {
		const delay = 5000
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = true
		},delay)
	}
})

window.addEventListener('DOMContentLoaded', () => {
	const converter = new showdown.Converter({'tables': true, 'tasklists': true, 'strikethrough': true})
	document.querySelector('textarea').addEventListener('input', () => {
		const markdown = document.querySelector('textarea').value
		const html = converter.makeHtml(markdown)
		document.querySelector('#markdown').innerHTML = html
	})
})
