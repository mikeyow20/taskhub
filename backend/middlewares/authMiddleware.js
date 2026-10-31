const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1]; // Extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } else {
            res.status(401);
            throw new Error("Not authorized");
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(401);
        throw new Error("Not authorized");
    }
};

const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as admin");
    }
};

module.exports = { protect, adminOnly };