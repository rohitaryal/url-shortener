function isValidUrl(url) {
	try {
		url = new URL(url);
	} catch {
		return false;
	}

	return url.protocol == "http:" || url.protocol == "https:";
}

function randomPath(n) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	let result = '';
	for (let i = 0; i < n; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

export { isValidUrl, randomPath };
