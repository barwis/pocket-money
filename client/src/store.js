import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// import { dateTimeReducer } from './components/DateTime/reducers';
import settings from './components/settings/slice';
import calendar from './components/calendar/slice';
import forecast from './components/forecast/slice';
import weather from './components/weather/slice';
import recycle from './components/recycle/slice';
import icons from './components/iconsList/slice';
import auth from './components/_common/auth/slice';

const reducers = {
	settings,
	calendar,
	forecast,
	weather,
	recycle,
	icons,
	auth
};

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: autoMergeLevel2
};

const rootReducer = combineReducers( reducers );
const persistedReducer = persistReducer( persistConfig, rootReducer );

// let persistor = persistStore( store );
// let store = createStore(
// 	persistedReducer,
// 	composeWithDevTools(
// 		applyMiddleware( thunk )
// 	)
// );

const store = createStore(
	persistedReducer,
	composeWithDevTools(
		applyMiddleware( thunk )
	)
);

let persistor = persistStore( store );

// let persistor = persistStore( store );

export { store, persistor };

// export const configureStore = () =>
// 	createStore(
// 		persistedReducer,
// 		composeWithDevTools(
// 			applyMiddleware( thunk )
// 		)
// 	);
