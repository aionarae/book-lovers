const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // get a book by it's ID
    book: async (parent, { bookId }) => {
      return Book
        .findOne({ bookId: bookId })
        .populate('savedBooks');
    },
    // get a user by their username
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  }
}