module.exports = (error, _, response, __) => {
	console.log('Error-Handler', error)
	response.sendStatus(500)
}
