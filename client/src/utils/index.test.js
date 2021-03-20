import fetchWithTimeout from './fetchWithTimeout';

const payload = { foo: 'bar' }


describe( 'fetchwithTimeout', () => {
	global.fetch = jest.fn( () =>
		Promise.resolve({ json: () => Promise.resolve( payload ) })
	);

	beforeEach( () => {
		fetch.mockClear();
	});

	it( 'calls with fetch', async () => {
		const request = await fetchWithTimeout( '/', { timeout: Math.random() * 1000 });
		expect( fetch ).toHaveBeenCalledTimes( 1 );
		expect( request.json() ).resolves.toEqual( payload );
	});
})