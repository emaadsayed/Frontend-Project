const { User, Post, Follower, Like, Comment } = require("../models/model");
const bcrypt = require("bcrypt");
const validator = require("validator");

module.exports = {
  Query: {
    user: async (_, { id }) => {
      try {
        return await User.findById(id);
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error}`);
      }
    },
    posts: async (_, { pageLimit }) => {
      try {
        return await Post.find().limit(pageLimit).sort({ timestamp: -1 });
      } catch (error) {
        throw new Error(`Failed to fetch posts: ${error}`);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password, fullName }) => {
      try {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          username,
          email,
          password: hashedPassword,
          fullName,
        });
        await user.save();
        return user;
      } catch (error) {
        throw new Error("Could not register user: " + error.message);
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        return user;
      } catch (error) {
        throw new Error("Could not log in: " + error.message);
      }
    },
    auth0: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        throw new Error("Could not log in: " + error.message);
      }
    },
    createPost: async (_, args) => {
      try {
        return await Post.create(args);
      } catch (error) {
        throw new Error(`Failed to create post: ${error}`);
      }
    },
    followUser: async (_, { userId, loggedInUserId }) => {
      try {
        const follower = new Follower({
          follower: loggedInUserId,
          following: userId,
        });
        await follower.save();
        return follower;
      } catch (error) {
        throw new Error(`Failed to follow user: ${error}`);
      }
    },
    unfollowUser: async (_, { userId, loggedInUserId }) => {
      try {
        await Follower.deleteOne({
          follower: loggedInUserId,
          following: userId,
        });
        return "Unfollowed successfully";
      } catch (error) {
        throw new Error(`Failed to unfollow user: ${error}`);
      }
    },
    likePost: async (_, { postId, loggedInUserId }) => {
      try {
        const like = new Like({ user: loggedInUserId, post: postId });
        await like.save();
        return like;
      } catch (error) {
        throw new Error(`Failed to like post: ${error}`);
      }
    },
    unlikePost: async (_, { postId, loggedInUserId }) => {
      try {
        await Like.deleteOne({ user: loggedInUserId, post: postId });
        return "Unliked successfully";
      } catch (error) {
        throw new Error(`Failed to unlike post: ${error}`);
      }
    },
    addComment: async (_, args) => {
      try {
        return await Comment.create(args);
      } catch (error) {
        throw new Error(`Failed to add comment: ${error}`);
      }
    },
  },
  User: {
    posts: async (parent) => {
      try {
        return await Post.find({ createdBy: parent.id }).sort({
          timestamp: -1,
        });
      } catch (error) {
        throw new Error(`Failed to fetch user's posts: ${error}`);
      }
    },
    followers: async (parent) => {
      try {
        return await Follower.find({ following: parent.id });
      } catch (error) {
        throw new Error(`Failed to fetch user's followers: ${error}`);
      }
    },
    following: async (parent) => {
      try {
        return await Follower.find({ follower: parent.id });
      } catch (error) {
        throw new Error(`Failed to fetch user's following: ${error}`);
      }
    },
  },
  Post: {
    createdBy: async (parent) => {
      try {
        return await User.findById(parent.createdBy).sort({ timestamp: -1 });
      } catch (error) {
        throw new Error(`Failed to fetch post's author: ${error}`);
      }
    },
    likes: async (parent) => {
      try {
        return await Like.find({ post: parent.id });
      } catch (error) {
        throw new Error(`Failed to fetch post's likes: ${error}`);
      }
    },
    comments: async (parent) => {
      try {
        return await Comment.find({ post: parent.id });
      } catch (error) {
        throw new Error(`Failed to fetch post's comments: ${error}`);
      }
    },
  },
  Follower: {
    follower: async (parent) => {
      try {
        return await User.findById(parent.follower);
      } catch (error) {
        throw new Error(`Failed to fetch follower: ${error}`);
      }
    },
  },
  Like: {
    user: async (parent) => {
      try {
        return await User.findById(parent.user);
      } catch (error) {
        throw new Error(`Failed to fetch user who liked the post: ${error}`);
      }
    },
  },
  Comment: {
    user: async (parent) => {
      try {
        return await User.findById(parent.user);
      } catch (error) {
        throw new Error(`Failed to fetch user who commented: ${error}`);
      }
    },
  },
};
