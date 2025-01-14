import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from '../../application/store/configureStore';
import PlaylistContainer from './PlaylistContainer';

const meta = {
  component: PlaylistContainer,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Story />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    ),
  ],
  parameters: {
    reactRouter: {
      routePath: '/playlist/:id',
      routeParams: { id: 'PLx8rAXc66SGIqrxzBZ9yaGx2sGbby51dM' }
    }
  }
} satisfies Meta<typeof PlaylistContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDifferentId: Story = {
  parameters: {
    reactRouter: {
      routePath: '/playlist/:id',
      routeParams: { id: 'PLx8rAXc66SGIqrxzBZ9yaGx2sGbby51dM' }
    }
  }
};