import { createAction } from '@reduxjs/toolkit';

export const setHelloWorldMessage = createAction<string>('HELLO_WORLD/SET_MESSAGE');
