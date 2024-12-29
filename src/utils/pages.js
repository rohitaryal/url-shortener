export const html = 
`
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>URL Shortener</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			border: none;
			outline: none;
			box-sizing: border-box;
		}

		body {
			height: 100vh;
			width: 100vw;
			color: #fff;
			display: flex;
			overflow: hidden;
			align-items: center;
			justify-content: center;
			background-color: #1e1e1e;
			flex-direction: column;
			gap: 5em;
		}

		.url-container {
			display: flex;
			overflow: hidden;
			border-radius: 0px;
			transition-duration: 0.1s;
			filter: drop-shadow(0 10px 10px red);
			animation: hue 10s linear infinite;
		}

		@keyframes hue {

			0%,
			100% {
				filter: drop-shadow(0 10px 10px red) hue-rotate(0deg);
			}

			50% {
				filter: drop-shadow(0 10px 10px red) hue-rotate(360deg);
			}
		}

		.url-container button {
			cursor: pointer;
			box-shadow: 0 0 0 #fff;
			background-color: rgb(160, 255, 71);
			color: #000000;
			font-weight: 900;
			transition-duration: 0.2s;
			transform-origin: 0%;
			font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
				'Helvetica Neue', sans-serif;
		}

		.url-container button:hover {
			transform: scale(1.15);
		}

		.url-container input,
		.url-container button {
			font-size: 1.2em;
			padding: 0.5em 0.8em;
		}

		.result-holder,
		.detail-holder {
			cursor: pointer;
			visibility: hidden;
			text-decoration: underline;
		}

		.result-holder.active,
		.detail-holder.active {
			visibility: visible;
		}

		.result-holder::after {
			content: '🔗';
		}
	</style>
</head>

<body>
	<div class="url-container">
		<input type="url" placeholder="URL here" />
		<button>SHORTEN</button>
	</div>

	<p class="result-holder"></p>
	<br />
	<p class="detail-holder"></p>

	<script>
		let input = document.querySelector('input');
		let button = document.querySelector('button');
		let detail = document.querySelector(".detail-holder");
		let result = document.querySelector('.result-holder');

		input.onchange = handleChange;
		input.onkeydown = handleChange;

		button.onclick = (e) => {
			button.innerHTML = 'WAITING';
			result.classList.remove('active');
			detail.classList.remove('active');

			if (input.value.length == 0 || !isValidUrl(input.value)) {
				buttonMsg('&nbsp;INVALID&nbsp;&nbsp;');
				return;
			} else if (isShrinkedUrl(input.value)) {
				let { searchParams } = new URL(input.value);
				let query = searchParams.get("q");
				if (!query) {
					buttonMsg('&nbsp;INVALID&nbsp;&nbsp;');
					return;
				}
				fetch(\`/details?q=\${query}\`)
					.then(data => data.json())
					.then(data => {
						detail.classList.add("active");
						detail.innerText = JSON.stringify(data);
					})
					.catch(() => buttonMsg('&nbsp;&nbsp;FAILED&nbsp;&nbsp;'))
				return;
			}

			fetch('/shorten', {
				method: 'POST',
				body: JSON.stringify({
					url: input.value,
				}),
			})
				.then((data) => data.json())
				.then((data) => {
					result.innerHTML = data.shortUrl;
					button.innerText = 'SHORTEN';
					result.classList.add('active');
				})
				.catch(() => buttonMsg('&nbsp;&nbsp;FAILED&nbsp;&nbsp;'));
		};

		result.onclick = () => window.open(result.innerHTML, '_blank');

		function buttonMsg(message) {
			button.innerHTML = message;
			setTimeout(function () {
				button.innerText = 'SHORTEN';
			}, 2000);
		}

		function isValidUrl(url) {
			try {
				url = new URL(url);
			} catch {
				return false;
			}

			return url.protocol == 'http:' || url.protocol == 'https:';
		}

		function handleChange(e) {
			console.log('A');
			if (isShrinkedUrl(input.value)) {
				button.innerText = 'DETAILS';
			} else {
				button.innerText = 'SHORTEN';
			}

			if (e.keyCode === 13) {
				button.click();
			}
		}

		function isShrinkedUrl(url) {
			let regex = String.raw\`^(http|https):\\/\\/\${location.host}(\\/)?\\?q=[a-zA-Z0-9-_]*\`;
			regex = new RegExp(regex);

			return !!url.match(regex);
		}
	</script>
</body>

</html>
`;
