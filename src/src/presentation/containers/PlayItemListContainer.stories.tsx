import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../../application/store/configureStore';
import PlayItemListContainer from './PlayItemListContainer';

const meta = {
  component: PlayItemListContainer,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof PlayItemListContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};