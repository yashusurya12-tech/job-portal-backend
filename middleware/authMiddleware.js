import jwt from "jsonwebtoken";

// Verify whether the user has a valid JWT token
export function verifyToken(req, res, next) {
    try {

        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Verify the token using JWT secret
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user details in request
        req.user = decodedToken;

        // Continue to the next middleware/route
        next();

    } catch (err) {
        next(err);
    }
}


// Allow only specific user roles
export function allowRoles(...roles) {
    return (req, res, next) => {

        // Check whether user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Continue if role is allowed
        next();
    };
}