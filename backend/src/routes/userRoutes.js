const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");

function createUserRoutes({ repository }) {
  const router = require("express").Router({ mergeParams: true });

  router.get(
    "/profile",
    asyncHandler(async (req, res) => {
      const summary = await getExistingUserSummary(repository, req.params.userId);
      res.json(summary);
    })
  );

  router.patch(
    "/profile",
    asyncHandler(async (req, res) => {
      const user = await repository.updateUserProfile(req.params.userId, {
        nickname: req.body.nickname,
        profileImage: req.body.profileImage
      });

      if (!user) {
        throw new HttpError("사용자를 찾을 수 없습니다.", 404, {
          code: "USER_NOT_FOUND"
        });
      }

      res.json({ user });
    })
  );

  router.get(
    "/preferences",
    asyncHandler(async (req, res) => {
      const user = await getExistingUser(repository, req.params.userId);
      res.json({ favoriteGenres: user.favoriteGenres || [] });
    })
  );

  router.put(
    "/preferences",
    asyncHandler(async (req, res) => {
      const favoriteGenres = req.body.favoriteGenres;
      if (!Array.isArray(favoriteGenres)) {
        return res.status(400).json({
          message: "favoriteGenres는 배열이어야 합니다.",
          code: "INVALID_FAVORITE_GENRES"
        });
      }

      const user = await repository.updateUserPreferences(
        req.params.userId,
        favoriteGenres
      );

      if (!user) {
        throw new HttpError("사용자를 찾을 수 없습니다.", 404, {
          code: "USER_NOT_FOUND"
        });
      }

      res.json({
        favoriteGenres: user.favoriteGenres,
        user
      });
    })
  );

  return router;
}

async function getExistingUser(repository, userId) {
  const user = await repository.getUser(userId);
  if (!user) {
    throw new HttpError("사용자를 찾을 수 없습니다.", 404, {
      code: "USER_NOT_FOUND"
    });
  }

  return user;
}

async function getExistingUserSummary(repository, userId) {
  const summary = await repository.getUserSummary(userId);
  if (!summary.user) {
    throw new HttpError("사용자를 찾을 수 없습니다.", 404, {
      code: "USER_NOT_FOUND"
    });
  }

  return summary;
}

module.exports = { createUserRoutes };
