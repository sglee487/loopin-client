import type { Meta, StoryObj } from '@storybook/react';

import { loader } from './YoutubeListItem';

const meta = {
  component: loader,
} satisfies Meta<typeof loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};