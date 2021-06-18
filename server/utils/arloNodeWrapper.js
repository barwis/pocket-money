const Arlo = require( 'node-arlo' );
const util = require( 'util' );

class ArloNodeWrapper extends Arlo {
	async login ( user, password ) {
		const superLoginPromisified = util.promisify( super.login ).bind( this );
		await superLoginPromisified( user, password );
		return this.token;
	}

	async getFixedDevices () {
		if ( this.token === undefined ) {
			return new Error( 'not logged in' );
		} else {
			// console.log( 'token', this.token );
		}

		// return superGetDevicePromisified().then( () => {
		// 	return 'asd';
		// });

		this.getDevices( ( asd ) => {
			console.log( 'cbasdasd' );
		});

		return this.processDevices();
	}

	processDevices () {
		return Object.entries( this.devices ).map( ( [key, d] ) => {
			console.log( key, d.constructor.name );
			const { id, device, isSubscribed } = d;

			return {
				id,
				device,
				deviceName: device.deviceName,
				deviceType: device.deviceType,
				thumbnail: device.presignedLastImageUrl,
				isSubscribed,
				type: d.constructor.name
			};
		});
	}

	getDeviceById ( cameraId ) {
		return Object.values( this.devices ).find( d => d.device.deviceId === cameraId );
	}
}

module.exports = ArloNodeWrapper;
