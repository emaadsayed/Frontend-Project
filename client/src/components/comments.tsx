import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../graphql/mutation";

// Define the types
interface User {
    username: string;
    profilePictureUrl: string | null;
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

interface CommentsProps {
    post: Post;
}

export function Comments({ post }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>(post.comments);
    const [comment, setComment] = useState('');
    const [userId, setUserId] = useState(localStorage.getItem("id"))

    const [addComent] = useMutation(ADD_COMMENT);

    // Function to handle submitting a new comment
    const handleSubmitComment = (event: any) => {
        event.preventDefault();

        addComent({
            variables: {
                content: comment,
                post: post.id,
                user: userId
            },
        }).then(() => {
            setComment('');
        }).catch(error => console.log(error.message));
    }

    // Update comments when the post data changes
    useEffect(() => {
        setComments(post.comments)
    }, [post]);

    return (
        <>
            <div className="p-4 pt-1 pb-4">
                {comments.map((item, index) => (
                    <p key={index} className="mb-1">
                        <Link to="/login">
                            <span className="mr-1 font-bold">{item.user?.fullName}</span>
                        </Link>
                        <span>{item.content}</span>
                    </p>
                ))}
            </div>


            <div className="border-t border-gray-primary">
                <form
                    className="flex justify-between pl-0 pr-5"
                >
                    <input
                        aria-label="Add a comment"
                        autoComplete="off"
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4"
                        type="text"
                        name="add-comment"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={({ target }) => setComment(target.value)}
                    />
                    <button
                        className={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
                        type="button"
                        disabled={comment.length < 1}
                        onClick={handleSubmitComment}
                    >
                        Post
                    </button>
                </form>
            </div>
        </>
    );
}