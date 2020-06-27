const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./Models/User');

/**
 * In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request.
 * If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
 * Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
 * In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
 * This is what the serializeUser and deserializeUser is doing
 */
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

/**
 * By default, LocalStrategy expects to find credentials in parameters named username and password.
 * If your site prefers to name these fields differently, options are available to change the defaults.
 */
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      // Check if the username exists in the database
      const currentUser = await User.findOne({ where: { username } });
      // If it doesn't we will return a message saying that the username doesn't exist so they cannot authenticate as that user
      if (!currentUser) {
        return done(null, false, { message: 'User does not exist' });
      }
      // Compare the password the user has supplied with the hashed and salted password if they match then we will authenticate them
      bcrypt.compare(password, currentUser.password, (error, isMatch) => {
        if (error) throw error;
        if (isMatch) {
          return done(null, currentUser);
        }
        // If it fails then the user has entered an incorrect password
        return done(null, false, { message: 'Password incorrect' });
      });
      return done(null, currentUser);
    } catch (error) {
      return done(error);
    }
  }
));
