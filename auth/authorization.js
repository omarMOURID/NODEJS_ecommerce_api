const onlyAdmin = (req, res, next) => {
    const user =req.user;
    
    if (user.role !== "admin") {
        res.status(403).send("Only admin have access!");
    } else {
        next();
    }
};

module.exports = onlyAdmin;