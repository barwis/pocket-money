
const iconsData = [
	{
		id: 116,
		symbols: [
			{
				id: 'sun',
				symbolRef: 'sunSymbol',
				symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
				attributes: {
					fill: 'none',
					stroke: '#F1C413',
					width: 35,
					height: 35
				},
				masks: ['cloud2'],
				transform: [5, 10]
			},
			{
				id: 'cloud2',
				symbolRef: 'cloudSymbol',
				symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
				attributes: {
					fill: 'none',
					stroke: '#3996D2',
					width: 44,
					height: 28
				},
				transform: [12, 18]
			}
		]
	},
	{
		id: 113,
		symbols: [
			{
				id: 'sun',
				symbolRef: 'sunSymbol',
				symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
				attributes: {
					fill: 'none',
					stroke: '#F1C413',
					width: 36,
					height: 36
				},
				transform: [14, 14]
			}
		]
	},
	{
		id: 176,
		symbols: [
			{
				id: 'cloud3',
				symbolRef: 'cloudFlippedSymbol',
				symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
				attributes: {
					fill: 'none',
					stroke: '#3996D2',
					width: 25,
					height: 20
				},
				masks: ['sun', 'cloud2'],
				transform: [8, 20]
			},
			{
				id: 'sun',
				symbolRef: 'sunSymbol',
				symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
				attributes: {
					fill: 'none',
					stroke: '#F1C413',
					width: 29,
					height: 29
				},
				masks: ['cloud2'],
				transform: [11, 12]
			},
			{
				id: 'cloud2',
				symbolRef: 'cloudSymbol',
				symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
				attributes: {
					fill: 'none',
					stroke: '#3996D2',
					width: 44,
					height: 28
				},
				transform: [12, 17]
			}
		]
	}

];

export default iconsData;
