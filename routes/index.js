module.exports = (app) => {
    app.get('/', (req, res) => {
        res.json({works: true});
    });
    require("./register")(app);
    require("./login")(app);
    require("./post")(app);
    require("./comment")(app)
    require("./delete")(app);
    require("./feed")(app);
};