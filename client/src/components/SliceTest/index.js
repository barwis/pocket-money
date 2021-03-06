import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

// actions
import { fetchDispatcher } from './slice'

import styled from 'styled-components/macro';

const Container = styled.div`
	color: white;
`;


const SliceTest = () => {
	const dispatch = useDispatch();
	const { status } = useSelector(state => state.sliceTest)
	return (
		<Container>{status}
			<button onClick={() => dispatch(fetchDispatcher('test'))}>click me</button>

		</Container>
	)
}

export default SliceTest;