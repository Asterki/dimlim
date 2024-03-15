import { Strategy as LocalStrategy } from 'passport-local';

const authenticationStrategies = {
    local: new LocalStrategy((username: string, password: string, done) => {
         //   User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) { return done(null, false); }
        //     if (!user.verifyPassword(password)) { return done(null, false); }
        //     return done(null, user);
        //   });
    })
}

export default authenticationStrategies;