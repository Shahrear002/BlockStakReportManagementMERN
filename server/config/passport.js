const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('User')

const cookieExtractor = (req) => {
    let token = null;

    if(req && req.cookies) {
        token = req.cookies['accessToken'];
    }

    return token;
}

module.exports = passport => {
    const opts = {}
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = process.env.secretOrKey

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null, user)
                }
                else {
                    return done(null, false)
                }
            })
            .catch(err => console.log(err))
    }))
}