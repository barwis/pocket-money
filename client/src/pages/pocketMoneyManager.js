import React from 'react';
import { GoogleLogin } from 'react-google-login';

const PocketMoneyManager = () => {
	const handleLogin = async googleData => {
		const res = await fetch( `http://${LOCAL_IP}:5000/auth`, {
			method: 'POST',
			body: JSON.stringify({ token: googleData.tokenId }),
			headers: { 'Content-Type': 'application/json' }
		});
		const data = await res.json();
		// store returned user somehow
	};

	return (
		<div>
			<span>log in please</span>

			<GoogleLogin
				clientId={APP_GOOGLE_CLIENT_ID}
				buttonText="Log in with Google"
				onSuccess={handleLogin}
				onFailure={handleLogin}
				cookiePolicy={'single_host_origin'}
			/>

		</div>
	);
};

export default PocketMoneyManager;
