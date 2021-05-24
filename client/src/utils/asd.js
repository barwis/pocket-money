
const stateHandlers = {
	pending: { lastFetchStatus: 'fetching' },
	fulfilled: {
		toUpdateWithPayload: 'lastUpdated',
		staticData: { lastFetchStatus: 'ok' }
	},
	rejected: { lastFetchStatus: 'error' }

};

const asd = ( builder, thunk, stateHandlers ) => {
	console.log( 'builder', builder );
	Object.keys( stateHandlers ).forEach( key => {
		const item = stateHandlers[key];

		// getStaticData to update
		const searchKey = 'toUpdateWithPayload';
		const deeper = Object.keys( item ).includes( searchKey );
		const staticData = deeper ? item.staticData : item;

		console.log( 'staticData', staticData );

		builder.addCase( thunk[key], ( state, action ) => {
			state.lastFetchStatus = 'pupka';
			// console.log( 'case', key, slice );

			for ( const [key, value] of Object.entries( staticData ) ) {
				console.log( `${key}: ${value}` );
				state[key] = value;
			}
		});
	});
};

export default asd;
