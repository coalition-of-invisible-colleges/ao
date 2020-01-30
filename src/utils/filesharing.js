const ipfsClient = require('ipfs-http-client')

let ipfs

function initialize() {
	console.log('initializing filesharing')
	ipfs = ipfsClient('http://localhost:5001')
}

function scanMemes() {
	try {
		console.log('scanning memes')
		let promise = ipfs.addFromFs('../.ao/memes', { recursive: true })
		console.log("promise is", promise)
		Promise.all([promise]).then((result) => {
			console.log("result2 is", result)
			console.log("result length is ", result[0].length)
			let hash = result[0][result.length - 1].hash
			Promise.all([hash]).then((hashresult) => {
				let files = ipfs.get(hashresult)
				Promise.all([files]).then((filesresult) => {
					let pin = ipfs.pin.add(hashresult)
					Promise.all([pin]).then((pinresult) => {
						console.log("all files are")
						console.log(filesresult)
					})
				})
			})
		})
	} catch(err) {
		console.log("scanning memes failed. error: ", err)
	}
}

function getFile(ipfsPath) {
	// let stream = ipfs.catReadableStream(ipfsPath).then(response => response.blob())
}

export default {
	initialize,
	scanMemes,
	getFile
}