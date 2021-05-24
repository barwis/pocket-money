const dataUpdate = ( dispatch, action, interval = 600000, callback = null ) => {
	dispatch( action() );

	const intervalId = setInterval( () => {
		dispatch( action() );
		if ( callback ) { callback(); }
	}, interval );

	return () => clearInterval( intervalId );
};

export default dataUpdate;
