import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from "../../application/store/configureStore";
import PlaylistsContainer from './PlaylistsContainer';

const meta = {
  component: PlaylistsContainer,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
  tags: ['autodocs']
} satisfies Meta<typeof PlaylistsContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

// Success case with mock data
export const Default: Story = {
  parameters: {
    msw: {
      // handlers: [
      //   http.get('http://localhost:8080/api/v1/playlists', () => {
      //     return HttpResponse.json({
      //       data: {
      //         content: [
      //           {
      //             playlistId: "PLx8rAXc66SGIqrxzBZ9yaGx2sGbby51dM",
      //             channelId: "UCYzIlosTCqwoRUzNgV21o_Q",
      //             title: "Test Playlist",
      //             description: "Test Description",
      //             thumbnail: "https://i.ytimg.com/vi/_xnBucjnPuQ/sddefault.jpg",
      //             channelTitle: "Test Channel",
      //             localized: {
      //               title: "Test Playlist",
      //               description: "Test Description"
      //             },
      //             contentDetails: {
      //               itemCount: 16
      //             },
      //             publishedAt: "2022-05-31T17:22:37.377Z",
      //             updatedAt: "2024-03-21T06:30:48.085Z"
      //           }
      //         ]
      //       }
      //     });
      //   })
      // ]
    }
  }
};

// Loading state
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:8080/api/v1/playlists', async () => {
          await new Promise(resolve => setTimeout(resolve, 3000)); // Delay response
          return HttpResponse.json({ data: { content: [] } });
        })
      ]
    }
  }
};

// Error state
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:8080/api/v1/playlists', () => {
          return new HttpResponse(null, { status: 500 });
        })
      ]
    }
  }
};