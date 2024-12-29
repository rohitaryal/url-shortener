import Router from "./utils/router";
import { html } from "./utils/pages.js";
import { isValidUrl, randomPath } from "./utils/url.js";

const app = new Router();

app.get("/", async (req, res) => {
	let query = req.url.searchParams.get("q");

	if (query != null) {
		let target = await URLS.get(query, "json");
		return Response.redirect(target.url, 301);
	}

	return res.html(html);
});

app.post("/shorten", async (req, res) => {
	let body, url;
	let host = req.headers.get("host");

	try {
		body = await req.json();
	} catch {
		res.writeHead(501, "INVALID JSON");
		return res.json({ "error": "INVALID JSON" });
	}

	url = body.url;

	if (!isValidUrl(url)) {
		res.writeHead(501, "INVALID URL");
		return res.json({ "error": "INVALID URL" });
	}

	let randomUrl = randomPath(5);

	await URLS.put(randomUrl, JSON.stringify({
		url,
	}));

	randomUrl = `${req.url.protocol == "https:" ? "https://" : "http://"}${host}?q=${randomUrl}`;

	return res.json({
		shortUrl: randomUrl
	});
});

addEventListener("fetch", (event) => {
	event.respondWith(app.fetch(event.request));
});
