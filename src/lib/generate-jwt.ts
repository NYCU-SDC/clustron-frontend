import jwt from "jsonwebtoken";

const SECRET =
  "c2c68a58b33b4646876c68e4b83e693deeeea258dd48c53cd5c594b8a891614c";

const payload = {
  id: "u005",
  username: "John Chen",
  email: "john.chen@gmail.com",
  studentId: "116000444",
  accessLevel: "organizer",
  role: "Teacher",
  dept: "EE",
};

const token = jwt.sign(payload, SECRET, { expiresIn: "2h" });

console.log("Generated JWT:\n", token);
