const ipfsClient = require('ipfs-http-client')

function initialize() {
	const ipfs = ipfsClient('http://localhost:5001')
}

function scanMemes() {
	const result = ipfs.addFromFs('../.ao/memes', { recursive: true })
	setTimeout(() => {
		console.log("result is", result)
	}, 3000)
}

function getFile(ipfsPath) {
	// let stream = ipfs.catReadableStream(ipfsPath).then(response => response.blob())
}

export default {
	initialize,
	scanMemes,
	getFile
}