import Router from "./utils/router";
import { html } from "./utils/pages.js";
import { isValidUrl, randomPath } from "./utils/url.js";

const app = new Router();

app.get("/", async (req, res) => {
	let query = req.url.searchParams.get("q");

	if (query) {
		let target = await URLS.get(query, "json");
		if (target) {
			target.visits += 1;
			await URLS.put(query, JSON.stringify(target));
			return Response.redirect(target.url, 301);
		} else {
			return new Response(null, {
				status: 404,
				statusText: "NOT FOUND",
			});
		}
	}
});

app.get("/details", async (req, res) => {
	let query = req.url.searchParams.get("q");

	if (query) {
		let target = await URLS.get(query, "json");
		if (target) {
			return res.json(target);
		} else {
			return new Response(null, {
				status: 404,
				statusText: "NOT FOUND",
			})
		}
	}
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
		visits: 0,
		creator: req.client.ipAddress,
		date: new Date().toLocaleDateString(),
	}));

	randomUrl = `${req.url.protocol == "https:" ? "https://" : "http://"}${host}?q=${randomUrl}`;

	return res.json({
		shortUrl: randomUrl
	});
});

addEventListener("fetch", (event) => {
	event.respondWith(app.fetch(event.request));
});
