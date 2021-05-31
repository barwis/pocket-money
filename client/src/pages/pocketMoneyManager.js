import React from 'react';
import { GoogleLogin } from 'react-google-login';

import Auth from '../components/_common/auth';

const PocketMoneyManager = () => {
	const handleLogin = async googleData => {
		console.log( 'token', JSON.stringify({ token: googleData.tokenId }) );
		const res = await fetch( `http://${LOCAL_IP}:${API_PORT}/auth`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
			body: `token=${googleData.tokenId}`
		});
		const data = await res.json();
		// store returned user somehow
	};
	const responseGoogle = ( response ) => {
		console.log( 'res', response );
	};

	return (
		<div className="pmm">
			<Auth/>

		</div>
	);
};

export default PocketMoneyManager;
