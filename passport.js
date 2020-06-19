const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./Models/User');
const { options } = require('./routes/api/auth');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    // TODO: Implement model Postgres
    try {
      const currentUser = await User.findOne({ where: { username } });
      if (!currentUser) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if (!currentUser.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      return done(null, currentUser);
    } catch (error) {
      return done(error);
    }
  }
));
