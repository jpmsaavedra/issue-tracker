
/* main.js */

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	if(document.querySelector('aside')) {
		const delay = 5000
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = true
		},delay)
	}
    let converter = new showdown.Converter({'tables': true, 'tasklists': true, 'strikethrough': true})
    const options = converter.getOptions()
    console.log(options)
	document.querySelector('textarea').addEventListener('input', event => {
        console.log('change')
        const markdown = document.querySelector('textarea').value
        console.log(markdown)
		const html = converter.makeHtml(markdown)
		console.log(html)
		document.querySelector('article').innerHTML = html
	})
})
