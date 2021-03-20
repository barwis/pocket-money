async function fetchWithTimeout ( resource, options = {}) {
	const { timeout = 1000 } = options;
	const controller = new AbortController();
	/* istanbul ignore next */
	const id = setTimeout( () => controller.abort(), timeout );
	const response = await fetch( resource, {
		...options,
		signal: controller.signal
	});
	clearTimeout( id );
	return response;
}

export default fetchWithTimeout;
