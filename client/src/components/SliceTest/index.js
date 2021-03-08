import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// actions
import { fetchDispatcher } from './slice';

// import styled from 'styled-components/macro';

// const Container = styled.div`
// 	color: white;
// `;

const SliceTest = () => {
	const dispatch = useDispatch();
	const { status } = useSelector( state => state.sliceTest );
	return (
		<div className="container">{status}
			<button onClick={() => dispatch( fetchDispatcher( 'test' ) )}>click me</button>

		</div>
	);
};

export default SliceTest;
