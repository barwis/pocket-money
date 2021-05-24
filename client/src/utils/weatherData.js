const c = [
	{
		desc: [ 'Sunny', 'Clear Sky' ],
		code: [1000, 800],
		icon: ['113', 'c01']
	},
	{
		desc: ['Partly Cloudy', 'Few clouds'],
		code: [1003, 801],
		icon: ['116', 'c02']
	},
	{
		desc: ['Cloudy', 'Scattered Clouds'],
		code: [1006, 802],
		icon: ['119', 'c02']
	},
	{
		desc: ['Overcast', 'Overcast clouds'],
		code: [1009, 804],
		icon: ['112', 'c04']
	},
	{
		desc: ['Mist', 'Mist'],
		code: [1030, 700],
		icon: ['143', 'a01']
	},
	{
		desc: ['Mist', 'Smoke'],
		code: [1030, 711],
		icon: ['143', 'a02']
	},
	{
		desc: ['Mist', 'Haze'],
		code: [1030, 721],
		icon: ['143', 'a03']
	},
	{
		desc: ['Mist', 'Sand/Dust'],
		code: [1030, 731],
		icon: ['143', 'a04']
	},
	{
		desc: ['Patchy rain possible', null],
		code: [1063, null],
		icon: ['176', null]
	},
	{
		desc: ['Patchy snow possible', null],
		code: [1066, null],
		icon: ['179', null]
	},
	{
		desc: ['Patchy sleet possible', 'Mix snow/rain'],
		code: [1069, 610],
		icon: ['182', 's04']
	},
	{
		desc: ['Patchy freezing drizzle possible', null],
		code: [1072, null],
		icon: ['185', null]
	},
	{
		desc: ['Thundery outbreaks possible', null],
		code: [1087, null],
		icon: ['200']
	},
	{
		desc: ['Blowing snow', null],
		code: [1114, null],
		icon: ['227', null]
	},
	{
		desc: ['Blizzard', null],
		code: [1117, null],
		icon: ['230', null]
	},
	{
		desc: ['Fog', 'Fog'],
		code: [1135, 741],
		icon: ['248', 'a05']
	},
	{
		desc: ['Freezing fog', 'Freeziong Fog'],
		code: [1147, 751],
		icon: ['260', 'a06']
	},
	{
		desc: ['Patchy light drizzle', null],
		code: [1150, null],
		icon: ['263', null]
	},
	{
		desc: ['Light drizzle', 'Light Drizzle'],
		code: [1153, 300],
		icon: ['266', 'd01']
	},
	{
		desc: ['Freezing drizzle', 'Drizzle'],
		code: [1168, 301],
		icon: ['281', 'd02']
	},
	{
		desc: ['Freezing drizzle', 'Flurries'],
		code: [1168, 623],
		icon: ['281', 's06']
	},
	{
		desc: ['Heavy freezing drizzle', 'Heavy drizzle'],
		code: [1171, 302],
		icon: ['284', 'd03']
	},
	{
		desc: ['Patchy light rain', null],
		code: [1180, null],
		icon: ['293', null]
	},
	{
		desc: ['Light rain', 'Light rain'],
		code: [1183, 500],
		icon: ['296', 'r01']
	},
	{
		desc: ['Moderate rain at times', null],
		code: [1186, null],
		icon: ['299', null]
	},
	{
		desc: ['Moderate rain', 'Moderate rain'],
		code: [1189, 501],
		icon: ['302', 'r02']
	},
	{
		desc: ['Heavy rain at times', 'Heavy rain'],
		code: [1192, 502],
		icon: ['305', 'r03']
	},
	{
		desc: ['Heavy rain', 'Unknown precipation'],
		code: [1195, 900],
		icon: ['308', 'u00']
	},
	{
		desc: ['Light freezing rain', 'Freezing rain'],
		code: [1198, 511],
		icon: ['311', 'f01']
	},
	{
		desc: ['Moderate or heavy freezing rain', null],
		code: [1201, null],
		icon: ['314', null]
	},
	{
		desc: ['Light sleet', 'Sleet'],
		code: [1204, 611],
		icon: ['317', 's05']
	},
	{
		desc: ['Moderate or heavy sleet', 'Heavy Sleet'],
		code: [1207, 612],
		icon: ['320', 's05']
	},
	{
		desc: ['Patchy light snow', 'Light Snow'],
		code: [1210, 600],
		icon: ['323', 's01']
	},
	{
		desc: ['Light Snow', 'Snow'],
		code: [1213, 601],
		icon: ['326', 's02']
	},
	{
		desc: ['Patchy moderate snow', null],
		code: [1216, null],
		icon: ['329', null]
	},
	{
		desc: ['Moderate snow', null],
		code: [1219, null],
		icon: ['332', null]
	},
	{
		desc: ['Patch heavy snow', null],
		code: [1222, null],
		icon: ['335', null]
	},
	{
		desc: ['Heavy snow', 'Heavy snow'],
		code: [1225, 602],
		icon: ['338', 's03']
	},
	{
		desc: ['Ice pellets', null],
		code: [1237, null],
		icon: ['350', null]
	},
	{
		desc: ['Light rain shower', 'Light shower rain'],
		code: [1240, 520],
		icon: ['353', 'r04']
	},
	{
		desc: ['Moderate or heavy rain shower', 'Shower rain'],
		code: [1243, 521],
		icon: ['356', 'r05']
	},
	{
		desc: ['Torrential rain shower', 'Heavy shower rain'],
		code: [1246, 522],
		icon: ['359', 'r06']
	},
	{
		id: 41,
		desc: ['Light sleet showers', null],
		code: [1249, null],
		icon: ['362', null]
	},
	{
		id: 42,
		desc: ['Moderate or heavy sleet showers', null],
		code: [1252, null],
		icon: ['365', null]
	},
	{
		desc: ['Light snow showers', 'snow shower'],
		code: [1255, 601],
		icon: ['368', 's01']
	},
	{
		desc: ['Moderate or heavy snow showers', 'Heavy snow shower'],
		code: [1258, 622],
		icon: ['371', 's02']
	},
	{
		desc: ['Light showers of ice pellets', null],
		code: [1261, null],
		icon: ['374', null]
	},
	{
		desc: ['Moderate or heavy showers of ice pellets', null],
		code: [1264, null],
		icon: ['377', null]
	},
	{
		desc: ['Patchy light rain with thunder', 'Thunderstorm with light rain'],
		code: [1273, 200],
		icon: ['386', 't01']
	},
	{
		desc: ['Patchy light rain with thunder', 'Thunderstorm with rain'],
		code: [1273, 201],
		icon: ['386', 't02']
	},
	{
		desc: ['Patchy light rain with thunder', 'Thunderstorm with heavy rain'],
		code: [1273, 202],
		icon: ['386', 't03']
	},
	{
		desc: ['Moderate or heavy rain with thunder', 'Thunderstorm with light drizzle'],
		code: [1276, 230],
		icon: ['389', 't04']
	},
	{
		desc: ['Moderate or heavy rain with thunder', 'Thunderstorm with drizzle'],
		code: [1276, 231],
		icon: ['389', 't04']
	},
	{
		desc: ['Moderate or heavy rain with thunder', 'Thunderstorm with heavy drizzle'],
		code: [1276, 232],
		icon: ['389', 't04']
	},
	{
		desc: ['Patchy light snow with thunder', null],
		code: [1279, null],
		icon: ['392', null]
	},
	{
		desc: ['Moderate or heavy snow with thunder', 'Thunderstorm with Hail'],
		code: [1282, 233],
		icon: ['395', 't05']
	},
	{
		desc: [null, 'Broken clouds'],
		code: [null, 803],
		icon: [null, 'c03']
	}
];

const conditions = {
	getData: () => c,
	getDataBy: ( obj ) => {
		const { property, value } = obj;
		if ( !property ) {
			console.log( 'not enough params' );
		}

		let res = c.find( ( item, index ) => {
			if ( item[property].includes( value ) ) {
				return true;
			}
		});

		// Object.keys( res ).forEach( key => {
		// 	res[key] = res[key].filter( Boolean ); ;
		// });

		return res;
	}
};

// export default class Conditions {
// 	constructor () {
// 		this.data = conditions;
// 		this.lastQueryResult = {};
// 	}

// 	get () {
// 		return 'boo';
// 	}

// 	asd () {
// 		return 'dupa';
// 	}
// 	get result () {
// 		return this.lastQueryResult;
// 	}

// 	get allData () {
// 		return this.data;
// 	}

// 	// // get firstAvailableFromLastQuery ()

// 	sanityLastQueryResult () {
// 		// Object.values( this.lastQueryResult ).forEach( item => {
// 		// 	// console.log( '1', Array.isArray( item ), item );
// 		// 	// item.pop();
// 		// 	item = item.filter( Boolean );
// 		// });

// 		return this;
// 	}

// 	getDataBy ( q ) {
// 		const { property, value } = q;
// 		if ( !property ) {
// 			return this;
// 		} else {
// 			this.lastQueryResult = this.data.find( ( item, index ) => {
// 				if ( item[property].includes( value ) ) {
// 					return true;
// 				}
// 			});
// 			this.sanityLastQueryResult();
// 			return this;
// 		}
// 	}
// }

export default conditions;
