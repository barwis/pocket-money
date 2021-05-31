import React, { useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { logIn, logOut, handleLogin } from './slice';
import { useDispatch, useSelector } from '../../../utils/redux-hooks';

import './style.css';

const RenderProfile = profile => (
	<div className="profile">
		<img src={profile.imageUrl} />
		<div>{profile.name}</div>
	</div>
);

const Auth = () => {
	const allowLogOut = true;
	const { isLoggedIn } = useSelector( state => state.auth );
	const profile = useSelector( state => state.auth.data.profileObj );

	const dispatch = useDispatch();

	const responseGoogle = ( response ) => {
		console.log( 'logged in', response );
		dispatch( logIn( response ) );
		dispatch( handleLogin( response ) );
	};

	const logoutResponse = ( response ) => {
		dispatch( logOut( response ) );
	};

	const className = isLoggedIn ? 'logInButton loggedIn' : 'logInButton';

	return (
		<div className="auth">
			{isLoggedIn && <RenderProfile {...profile} /> }

			<div className={className}>
				<GoogleLogin
					clientId={CLIENT_ID}
					buttonText="Log in with Google"
					onSuccess={responseGoogle}
					onFailure={responseGoogle}
					cookiePolicy={'single_host_origin'}
					isSignedIn={true}
				/></div>
			{allowLogOut && isLoggedIn && <GoogleLogout
				clientId={CLIENT_ID}
				buttonText="Logout"
				onLogoutSuccess={logoutResponse}
			/>}

		</div>
	);
};

export default Auth;
