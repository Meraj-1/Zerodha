import express from "express";
import passport from "passport";

const router = express.Router();

//start login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:8000/register",
    // successRedirect: "/dashboard",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000")
  }
);

//logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
