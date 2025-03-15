import React from 'react';
import { useFollow } from "@hooks/useFollow"

interface FollowButtonProps {
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const { useFollowActions } = useFollow();
  const { isFollowing, isLoading, toggleFollow } = useFollowActions(userId);

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full ${isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-bm-green text-bm-black'
        }`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
