// src/presentation/containers/PlayItemListContainer.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../application/store/configureStore';
import PlayItemComponent from '../components/PlayItemComponent';
import { loadPlayItems } from '../../application/actions/playItemActions';
import { NewPlayItem } from '../../domain/entities/NewPlayItem';
import { PlayItemRootState } from '../../application/reducers/playItemReducer';

const PlayItemListContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: PlayItemRootState) => state.playItems);

  useEffect(() => {
    dispatch(loadPlayItems());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="play-item-list">
      {items.map((item: NewPlayItem) => (
        <PlayItemComponent key={item.playListId} item={item} />
      ))}
    </div>
  );
};

export default PlayItemListContainer;
