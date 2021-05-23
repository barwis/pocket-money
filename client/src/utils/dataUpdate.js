const dataUpdate = ( dispatch, callback, interval = 600000 ) => {
	dispatch( callback() );

	const intervalId = setInterval( () => {
		dispatch( callback() );
	}, interval );

	return () => clearInterval( intervalId );
};

export default dataUpdate;
