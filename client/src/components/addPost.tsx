import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../graphql/mutation";

export function AddPost() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("id"));

  const [addPost, { }] = useMutation(ADD_POST);

  // Function to handle adding a new post
  const handleAddPost = () => {
    // Validation: Check if post content and image URL are provided
    if (content == "") return setError("Post caption is required")
    if (imageUrl == "") return setError("Post image is required")
    
    addPost({
      variables: {
        content,
        imageUrl,
        createdBy: userId,
      },
    }).then(() => {
      // Clear content, image URL, and any previous error
      setContent("");
      setImageUrl("");
      setError("");
    }).catch(error => setError(error.message))
  };

  return (
    <div className="w-full">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter Post Caption
          </label>
          <textarea
            onChange={({ target }) => setContent(target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Caption"
            value={content}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Post Image
          </label>
          <input
            onChange={({ target }) => setImageUrl(target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Upload Image"
            value={imageUrl}
          ></input>
        </div>
        {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            style={{ backgroundColor: "#80808057" }}
            onClick={handleAddPost}
            className="font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
