// src/presentation/components/PlayItemComponent.tsx
import React from 'react';
import { NewPlayItem } from '../../domain/entities/NewPlayItem';

interface PlayItemComponentProps {
  item: NewPlayItem;
}

const PlayItemComponent: React.FC<PlayItemComponentProps> = ({ item }) => {
  return (
    <div className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-xl font-bold mt-2">{item.title}</h3>
      <p className="text-gray-600">{item.description}</p>
      <small className="text-gray-500">Published at: {item.publishedAt.toDateString()}</small>
    </div>
  );
};

export default PlayItemComponent;
