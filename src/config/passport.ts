import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "https://mako-poetic-macaque.ngrok-free.app/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Tìm hoặc tạo người dùng trong cơ sở dữ liệu
                const user = {
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                };
                // Lưu thông tin người dùng vào cơ sở dữ liệu nếu cần
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user: any, done) => {
    done(null, user);
});

// Deserialize user
passport.deserializeUser((user: any, done) => {
    done(null, user);
});

export default passport;