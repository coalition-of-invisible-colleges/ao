const ipfsClient = require('ipfs-http-client')
const { globSource } = ipfsClient
const BufferList = require('bl/BufferList')

let ipfs

function initialize() {
	console.log('initializing filesharing')
	ipfs = ipfsClient('http://localhost:5001')
}

async function scanMemes() {
	try {
		console.log('scanning memes')
		// let promise = ipfs.add(globSource('../.ao/memes', { recursive: true }))
		let hash
		for await (const file of ipfs.add(globSource('../.ao/memes', { recursive: true }))) {
			console.log("scanning meme")
			hash = file.cid
			console.log("meme scanned: ", String(file.cid))
		}
		// console.log("after scan memes")
		// console.log("CID is ", hash)
		// for await (const file of ipfs.get(hash)) {
		// 	console.log(file.path)
		// 	// let loadedfile = ipfs.get(file.path)
		// 	const content = new BufferList()
		// 	for await (const chunk of file.content) {
		// 		content.append(chunk)
		// 	}

		// 	console.log(content.toString())
		// }
		// console.log("all files are")
		// console.log(loaded)
		// console.log("promise is", promise)
		// Promise.all([promise]).then((result) => {
		// 	console.log("result2 is", result)
		// 	console.log("result length is ", result[0].length)
		// 	Promise.all([hash]).then((hashresult) => {
		// 		Promise.all([files]).then((filesresult) => {
		// 			Promise.all([pin]).then((pinresult) => {
		// 			})
		// 		})
		// 	})
		// })
	} catch(err) {
		console.log("scanning memes failed. error: ", err)
	}
}

function getFile(ipfsPath) {
	// let stream = ipfs.catReadableStream(ipfsPath).then(response => response.blob())
}

module.exports = {
	initialize,
	scanMemes,
	getFile
}