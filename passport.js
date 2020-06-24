const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./Models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const loadedUser = await User.findByPk(id);
    done(null, loadedUser);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const currentUser = await User.findOne({ where: { username } });
      if (!currentUser) {
        return done(null, false, { message: 'User does not exist' });
      }
      bcrypt.compare(password, currentUser.password, (error, isMatch) => {
        if (error) throw error;
        if (isMatch) {
          return done(null, currentUser);
        }
        return done(null, false, { message: 'Password incorrect' });
      });
      return done(null, currentUser);
    } catch (error) {
      return done(error);
    }
  }
));
