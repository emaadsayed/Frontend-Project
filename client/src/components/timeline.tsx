import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries";
import { Likes } from './likes';
import { Comments } from './comments';

// Define the types
interface User {
    username: string;
    profilePictureUrl: string;
    id: string
}

interface Comment {
    content: string;
    user: {
        fullName: string;
    };
}

interface Like {
    user: {
        id: string;
    };
}

interface Post {
    id: string;
    content: string;
    imageUrl: string;
    createdBy: User;
    comments: Comment[];
    likes: Like[];
}

export function Timeline() {
    // State to keep track of the limit for loading posts
    const [limit, setlimit] = useState(2);
    const [post, setPost] = useState<Post[]>([]);

    // Query data from the GraphQL server
    const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
        variables: { pageLimit: limit },
        pollInterval: 50,
    });

    if (error) console.log(error.message);

    // Function to handle scrolling and loading more posts
    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 500 && !loading) {
            setlimit((prev) => (prev + 2))
        }
    };

    useEffect(() => {
        if (data) {
            setPost(data.posts);
        }
        // Add an event listener to handle scrolling
        window.addEventListener('scroll', handleScroll);

        return () => {
            // Remove the event listener when the component unmounts
            window.removeEventListener('scroll', handleScroll);
        };
    }, [data]);


    return (
        <div className="mx-auto max-w-xl">
            {post?.map((item, index) => (
                <div key={index} className="rounded col-span-4 border bg-white border-gray-primary mb-12">
                    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
                        <div className="flex items-center">
                            <Link to={`/profile/${item.createdBy.id}`} className="flex items-center">
                                <img
                                    className="rounded-full h-8 w-8 flex mr-3 object-cover"
                                    src={item.createdBy.profilePictureUrl}
                                />
                                <p className="font-bold">{item.createdBy.username}</p>
                            </Link>
                        </div>
                    </div>
                    <img src={item.imageUrl} />
                    <Likes totalLike={item.likes.length} likeData={item.likes} postId={item.id} />
                    <div className="p-4 pt-2 pb-1">
                        <span className="mr-1 font-bold">{item.createdBy.username}</span>
                        <span className="italic">{item.content}</span>
                    </div>
                    <Comments post={item} />
                </div>
            ))}
        </div>
    );
}