import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '@/application/state/helloWorldReducer';

const HelloWorldComponent: React.FC = () => {
  const message = useSelector((state: { helloWorld: { message: string } }) => state.helloWorld.message);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setMessage('Hello World!'));
  };

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={handleClick}>
        Set Message
      </button>
    </div>
  );
};

export default HelloWorldComponent;
