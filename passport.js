const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./Models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    try {
      const currentUser = await User.findOne({ where: { username } });
      if (!currentUser) {
        return done(null, false, { message: 'User does not exist' });
      }
      // TODO: Convert to async await
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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
