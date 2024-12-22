import type { Meta, StoryObj } from '@storybook/react';

import PlayItemComponent from './PlayItemComponent';

const meta = {
  component: PlayItemComponent,
} satisfies Meta<typeof PlayItemComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      playListId: '1',
      channelId: 'channel1',
      title: 'Sample Title',
      description: 'Sample Description',
      thumbnail: 'https://picsum.photos/500',
      channelTitle: 'Sample Channel',
      publishedAt: new Date(),
      position: 0,
      resource: { 
        kind: '',
        videoId: ''
       },
       startSeconds: 3
    }
  }
};