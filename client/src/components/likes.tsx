import { useState, useEffect } from 'react';
import { useMutation } from "@apollo/client";
import { LIKE, UNLIKE } from "../graphql/mutation";

interface Like {
    user: {
        id: string;
    };
}

interface LikesProps {
    totalLike: number;
    likeData: Like[];
    postId: string
}

export function Likes({ totalLike, likeData, postId }: LikesProps) {
    // State to track whether the user has liked the post
    const [toggleLiked, setToggleLiked] = useState(false);
    const [likes, setLikes] = useState(totalLike);

    const [userId, setUserId] = useState(localStorage.getItem("id"))

    const [addLike, { }] = useMutation(LIKE);
    const [removeLike, { }] = useMutation(UNLIKE);


    const handleToggleLiked = () => {
        if (!toggleLiked) {
             // If the post is not liked, add a like
            addLike({
                variables: {
                    postId: postId,
                    loggedInUserId: userId
                },
            }).then(() => {
                console.log("liked")
                setToggleLiked(true);
            }).catch(error => console.log(error.message));
        }
        else {
             // If the post is already liked, remove the like
            removeLike({
                variables: {
                    postId: postId,
                    loggedInUserId: userId
                },
            }).then(() => {
                console.log("unliked")
                setToggleLiked(false);
            }).catch(error => console.log(error.message));
        }
    };

    useEffect(() => {
        // Check if the user has already liked the post
        if (totalLike > 0) {
            likeData.forEach((item) => {
                if (item.user.id === userId) setToggleLiked(true);
            });
        }
        setLikes(totalLike)
    }, [likeData]);

    return (
        <>
            <div className="flex justify-between p-4">
                <div className="flex">
                    <svg
                        onClick={handleToggleLiked}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        tabIndex={0}
                        className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${toggleLiked ? 'fill-red text-red-primary' : 'text-black-light'
                            }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>
            </div>
            <div className="p-4 py-0">
                <p className="font-bold">{likes === 1 ? `${likes} like` : `${likes} likes`}</p>
            </div>
        </>
    );
}