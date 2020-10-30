const UserControllers = require("../controllers/user");
const router = require("express").Router();

router.post("/register", UserControllers.register);
router.post("/login", UserControllers.login);

module.exports = router;