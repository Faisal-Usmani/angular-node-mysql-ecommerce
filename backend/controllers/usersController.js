const pool = require("../server");
const bcrypt = require("../node_modules/bcryptjs/umd");
var jwt = require("jsonwebtoken");

exports.singup = async (req, res) => {
  const { email, firstName, lastName, address, city, state, pin, password } =
    req.body;
  const existingUser = await pool
    .promise()
    .query(`SELECT COUNT(*) AS COUNT FROM USERS WHERE EMAIL=?`, [email]);
  try {
    if (existingUser[0].count > 0) {
      return res.status(200).send("Email already Exits");
    }
    //encrypty password
    const hashPassword = await bcrypt.hash(password, 10);

    //insert in to table users
    await pool.promise().query(
      `INSERT INTO estore.users (email, firstName, lastName, address, city, state, pin, password)
        VALUES (?,?,?,?,?,?,?,?)`,
      [email, firstName, lastName, address, city, state, pin, hashPassword],
    );

    res.status(201).send({ message: "Success" });
  } catch (error) {
    res.status(500).send(error.message) || "Something went wrong";
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool
      .promise()
      .query(`SELECT * FROM USERS WHERE EMAIL=?`, [email]);
    if (users.length == 0) {
      return res.status(401).send({ message: "User  does not exist." });
    }
    const user = users[0][0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "invalid Password" });
    }

    //if user exist then create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "estore-secrete-key",
      { expiresIn: "1h" },
    );
    res.status(201).send({
      token,
      expiresInSeconds: 3600,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        city: user.city,
        state: user.state,
        pin: user.pin,
      },
      message: "Login Succesfull",
    });
  } catch (error) {
    console.log("Login Error:", err);
    res.status(500).send({
      err: err.code || "INTERNAL_ERROR",
      message: err.message || "Somthing went wrong ",
    });
  }
};
