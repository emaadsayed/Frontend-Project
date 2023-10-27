import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { USER_DATA } from '../graphql/queries';
import { FOLLOW, UNFOLLOW } from '../graphql/mutation';
import { useMutation } from "@apollo/client";
import { Header } from '../components/header';

// Define TypeScript interfaces
interface User {
  username: string;
  id: string,
  profilePictureUrl: string;
  posts: Post[];
  fullName: string;
  followers: Followers[];
  following: User[];
}

interface Followers {
  id: string;
  follower: {
    id: string;
  };
}

interface Post {
  likes: Like[];
  comments: Comment[];
  imageUrl: string
}

interface Like {
  id: string;
}

interface Comment {
  id: string;
}

export function Profile() {
  // Extract the user ID from the URL parameter
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("id"))

  // Using  Apollo Client's useQuery to fetch user data
  const { loading, error, data, refetch } = useQuery(USER_DATA, {
    variables: { userId: id },
  });

  const [followUser, { }] = useMutation(FOLLOW);
  const [unfollowUser, { }] = useMutation(UNFOLLOW);

  if (error) console.log(error.message);

  // Function to handle following/unfollowing a user
  const handleToggleFollow = () => {
    if (!isFollowingProfile) {
      // Follow the user
      followUser({
        variables: {
          userId: id,
          loggedInUserId: userId
        },
      }).then(() => {
        setIsFollowingProfile(true);
        refetch()
      }).catch(error => console.log(error.message));
    }
    else {
      // Unfollow the user
      unfollowUser({
        variables: {
          userId: id,
          loggedInUserId: userId
        },
      }).then(() => {
        setIsFollowingProfile(false);
        refetch()
      }).catch(error => console.log(error.message));
    }
  }

  useEffect(() => {
    document.title = 'Profile - Instagram';
      setUser(data?.user)
      // Checking if the logged-in user is following this user
      data?.user.followers.forEach((follower: Followers) => {
        if (follower.follower.id === userId) setIsFollowingProfile(true);
      });
  }, [data]);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-xl">
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
          <div className="container flex justify-center items-center">
            <img
              className="rounded-full h-40 w-40 flex object-cover"
              src={user?.profilePictureUrl}
            />
          </div>
          <div className="flex items-center justify-center flex-col col-span-2">
            <div className="container flex items-center">
              <p className="text-2xl mr-4">{user?.username}</p>
              {userId != user?.id && <button
                className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                type="button"
                onClick={handleToggleFollow}
              >
                {isFollowingProfile ? 'Unfollow' : 'Follow'}
              </button>}
            </div>
            <div className="container flex mt-4">
              <>
                <p className="mr-10">
                  <span className="font-bold">{user?.posts.length}</span> photos
                </p>
                <p className="mr-10">
                  <span className="font-bold">{user?.followers.length}</span> followers
                </p>
                <p className="mr-10">
                  <span className="font-bold">{user?.following.length}</span> following
                </p>
              </>
            </div>
            <div className="container mt-4">
              <p className="font-medium">{user?.fullName}</p>
            </div>
          </div>
        </div>
        <div className="h-16 border-t border-gray-primary mt-12 pt-4">
          <div className="grid grid-cols-3 gap-6 mt-4 mb-12" >
            {user?.posts.length != 0 && user?.posts.map((item, index) => (
              <div className="relative group" key={index}>
                <img src={item.imageUrl} />
                <div className="absolute bottom-0 left-0 bg-gray-200 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden">
                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item.likes.length}
                  </p>
                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item.comments.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {user?.posts.length == 0 && <p className="text-center text-2xl">No Posts Yet</p>}
        </div>
      </div>
    </div>
  )
}