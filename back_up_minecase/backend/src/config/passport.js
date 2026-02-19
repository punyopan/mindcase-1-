const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if user exists by Google ID
            let user = await User.findByGoogleId(profile.id);
            
            if (user) {
                return done(null, user);
            }

            // 2. Check if user exists by email (link accounts)
            if (profile.emails && profile.emails.length > 0) {
                 const email = profile.emails[0].value;
                 user = await User.findByEmail(email);
                 
                 if (user) {
                     // Link Google ID to existing user
                     await User.linkSocialId(user.id, 'google', profile.id);
                     return done(null, user);
                 }
            }

            // 3. Create new user
            const newUser = {
                googleId: profile.id,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                name: profile.displayName || 'Detective',
                passwordHash: null // Social login has no password
            };

            user = await User.createSocial(newUser);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
}

module.exports = passport;
