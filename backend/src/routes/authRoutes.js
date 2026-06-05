const { asyncHandler } = require("../utils/asyncHandler");

function createAuthRoutes({ repository, googleAuthService }) {
  const router = require("express").Router();

  router.post(
    "/google",
    asyncHandler(async (req, res) => {
      const profile = await googleAuthService.resolveProfile({
        idToken: req.body.idToken || req.body.credential,
        profile: req.body.profile
      });
      const result = await repository.upsertUserFromGoogleProfile(profile);

      res.status(result.isNewUser ? 201 : 200).json({
        user: result.user,
        isNewUser: result.isNewUser,
        needsPreferences: result.user.favoriteGenres.length === 0
      });
    })
  );

  return router;
}

module.exports = { createAuthRoutes };
