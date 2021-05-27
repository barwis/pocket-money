import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
// import { configureStore } from './store';
import { store, persistor } from './store';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

// const store = configureStore();

ReactDOM.render(
	<Provider store={ store }>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementById( 'root' )
);
