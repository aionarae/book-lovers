const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  
  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // remove a book from `savedBooks`

  Query: {
    // get a single user by either their id or their username
    user: async (parent, { id, username }) => {
      return User
        .findOne({ $or: [{ _id: id }, { 'savedBooks.username': username }] })
        .populate('savedBooks');
    },

    // get a single
    book: async (parent, { bookId }) => {
      return Book.findOne
    }
  },

  Mutation: {
    saveBook: async (parent, {authors, description, title, bookId, image, link}, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: {authors, description, title, bookId, image, link} } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;