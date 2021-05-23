// TODO: add unit tests

/**
 * Look for a number in array. If not found, returns closest number from array
 * @param  {Object[]} arr Array to look into
 * @param  {number} needle Number to locate
 * @param  {string} [method="floor"] comparison method
 * @returns {number} needle - if found in [arr]; otherwise returns closest number from arr
 */
const closestNumInArray = ( arr, needle, method = 'floor' ) => {
	return arr.reduce( ( a, b ) => {
		if ( method === 'floor' ) {
			return Math.abs( b - needle ) <= Math.abs( a - needle ) ? b : a;
		}
		if ( method === 'ceil' ) {
			return Math.abs( b - needle ) < Math.abs( a - needle ) ? b : a;
		}
	});
};

module.exports = { closestNumInArray };
