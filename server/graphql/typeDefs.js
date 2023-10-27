const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID
    username: String
    email: String
    fullName: String!
    profilePictureUrl: String
    posts: [Post]
    followers: [Follower]
    following: [Follower]
    likes: [Like]
    comments: [Comment]
  }

  type Post {
    id: ID!
    content: String
    imageUrl: String
    createdBy: User
    likes: [Like]
    comments: [Comment]
  }

  type Follower {
    id: ID
    follower: User
    following: User
  }

  type Like {
    id: ID!
    user: User
    post: Post
  }

  type Comment {
    id: ID!
    content: String
    user: User
    post: Post
  }

  type Query {
    user(id: ID!): User
    posts(pageLimit: Int!): [Post]
  }

  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
      fullName: String!
    ): User
    loginUser(email: String!, password: String!): User
    auth0(email: String!): User

    createPost(content: String!, imageUrl: String!, createdBy: String!): Post

    followUser(userId: ID!, loggedInUserId: ID!): Follower
    unfollowUser(userId: ID!, loggedInUserId: ID!): String

    likePost(postId: ID!, loggedInUserId: ID!): Like
    unlikePost(postId: ID!, loggedInUserId: ID!): String

    addComment(content: String!, post: ID!, user: ID!): Comment
  }
`;
