import { gql } from "@apollo/client";

// Mutation to add a comment to a post
export const ADD_COMMENT = gql`
mutation AddComment($content: String!, $post: ID!, $user: ID!) {
  addComment(content: $content, post: $post, user: $user) {
    content
  }
}
`;

// Mutation to like a post
export const LIKE = gql`
mutation LikePost($postId: ID!, $loggedInUserId: ID!) {
    likePost(postId: $postId, loggedInUserId: $loggedInUserId) {
      id
    }
  }
`;

// Mutation to unlike a post
export const UNLIKE = gql`
mutation UnlikePost($postId: ID!, $loggedInUserId: ID!) {
    unlikePost(postId: $postId, loggedInUserId: $loggedInUserId)
  }
`;

// Mutation to register a new user
export const SIGNUP = gql`
mutation Signup($username: String!, $email: String!, $password: String!, $fullName: String!) {
  registerUser(username: $username, email: $email, password: $password, fullName: $fullName) {
    id
  }
}
`;
// Mutation to log in a user
export const SIGNIN = gql`
mutation SigninUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    id
  }
}
`;

// Mutation to follow a user
export const FOLLOW= gql`
mutation Follow($userId: ID!, $loggedInUserId: ID!) {
  followUser(userId: $userId, loggedInUserId: $loggedInUserId) {
    id
  }
}
`;

// Mutation to add a new post
export const UNFOLLOW= gql`
mutation Unfollow($userId: ID!, $loggedInUserId: ID!) {
  unfollowUser(userId: $userId, loggedInUserId: $loggedInUserId)
}
`;

export const ADD_POST= gql`
mutation AddPost($content: String!, $imageUrl: String!, $createdBy: String!) {
  createPost(content: $content, imageUrl: $imageUrl, createdBy: $createdBy) {
    id
  }
}
`;

// Mutation to log in using Auth0
export const AUTH0_LOGIN= gql`
mutation Auth0Login($email: String!) {
  auth0(email: $email) {
    id
  }
}
`;


