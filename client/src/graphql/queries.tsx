import { gql } from "@apollo/client";

// Query to fetch all posts with their details
export const GET_ALL_PRODUCTS = gql`
query AllPost($pageLimit: Int!) {
  posts(pageLimit: $pageLimit) {
    id
    content
    imageUrl
    comments {
      content
      user {
        fullName
      }
    }
    likes {
      user {
        id
      }
    }
    createdBy {
      username
      profilePictureUrl
      id
    }
  }
}
`;

// Query to fetch user-specific data
export const USER_DATA = gql`
query User($userId: ID!) {
  user(id: $userId) {
    username
    id
    profilePictureUrl
    posts {
      likes {
        id
      }
      comments {
        id
      }
      imageUrl
    }
    fullName
    followers {
      id
      follower {
        id
      }
    }
    following {
      id
    }
  }
}
`;


