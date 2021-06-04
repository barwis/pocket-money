useEffect( () => {
	// const canvas = canvasRef.current;
	const snap = Snap( '#svg' );
	const symbols = snap.group().attr({ id: 'symbols' });
	// const cloud = s.path( 'M50.94,31.55c0.11-0.62,0.17-1.24,0.17-1.89c0-6.44-5.47-11.67-12.22-11.67c-5.24,0-9.69,3.15-11.43,7.57c-0.42-0.06-0.84-0.1-1.28-0.1c-4.45,0-8.07,3.34-8.29,7.54C14.56,33.45,12,36.17,12,39.47c0,3.61,3.06,6.53,6.84,6.53h29.33C52.5,46,56,42.66,56,38.53C56,35.34,53.89,32.62,50.94,31.55z' );

	// cloud symbol
	const sy = snap.symbol().attr({ id: 'cloud-symbol' });
	const cloud2 = snap.path( 'M39.44,14.05c0.11-0.62,0.17-1.24,0.17-1.89c0-6.44-5.47-11.67-12.22-11.67c-5.24,0-9.69,3.15-11.43,7.57c-0.42-0.06-0.84-0.1-1.28-0.1c-4.45,0-8.07,3.34-8.29,7.54c-3.33,0.45-5.89,3.16-5.89,6.46c0,3.61,3.06,6.53,6.84,6.53h29.33c4.32,0,7.82-3.34,7.82-7.47C44.5,17.84,42.39,15.12,39.44,14.05z' );
	sy.append( cloud2 );

	sy.appendTo( symbols );

	// add cloud symbol
	snap
		.use( 'cloud-symbol' )
		.transform( 't12, 18' )
		.attr({
			id: 'use-cloud2',
			fill: 'none',
			stroke: 'blue',
			class: 'cloud'
		});

	const maskGroup = snap.symbol();
	maskGroup.append( snap.rect( 0, 0, 64, 64 ).attr({ fill: 'white' }) );
	maskGroup.append( snap.use( 'cloud-symbol' ).transform( 't12, 18' ) );

	const snapLoadAsync = ( url ) => {
		return new Promise( ( resolve, reject ) => {
			try {
				Snap.load( url, function ( data ) {
					var sunSymbol = data.select( 'symbol' );
					sunSymbol.attr({ class: 'fadeIn' });
					snap.append( sunSymbol );

					const g = snap.g();
					g.use( sunSymbol ).transform( 't4, 9' );
					g.attr({ mask: snap.use( maskGroup ) });

					resolve();
				});
			} catch ( e ) {
				reject( new Error( e ) );
			}
		});
	};

	// var tux = snapLoadAsync( function () { Snap.load( 'http://localhost:8080/weather/64x64/day/svg/sun.svg' ); });
	var tux = snapLoadAsync( '/weather/64x64/day/svg/sun.svg' );
}, [] );
