// const roleGuard = (allowedRoles) => {
//   return (req, res, next) => {
//     const userRole = req.user.role;

//     if (!userRole) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - no role assigned' not" });
//     }

//     if (!allowedRoles.includes(userRole)) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden - insufficient permissions" });
//     }

//     next();
//   };
// };

// module.exports = roleGuard;
