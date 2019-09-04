const bcrypt = require('bcrypt');

/**
 * Performs a one-way encryption on the given string
 * @param {string} text - the text to be hashed.
 * @returns {Promise<string>} - the hash.
 */
exports.getHash = async function(text)
{
	var hash = await bcrypt.hash(text, 10, (err, encrypted) =>
	{
		if (err)
		{
			throw err; //It is important to throw the error here, and not return null, if you don't understand why, ask David De Angelis.
		}
		console.log('Hash is ' + encrypted + ' for text ' + text);
		return encrypted;
	});
	return hash;
}