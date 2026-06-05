const { HttpError } = require("../utils/httpError");

class GoogleAuthService {
  constructor(options = {}) {
    this.clientId = options.clientId || process.env.GOOGLE_CLIENT_ID;
    this.fetch = options.fetch || global.fetch;
    this.allowDevProfile =
      options.allowDevProfile ??
      (process.env.NODE_ENV !== "production" ||
        process.env.ALLOW_DEV_AUTH === "true");
  }

  async resolveProfile({ idToken, profile }) {
    if (idToken) {
      return this.verifyIdToken(idToken);
    }

    if (profile && this.allowDevProfile) {
      return normalizeProfile(profile);
    }

    throw new HttpError("Google ID 토큰이 필요합니다.", 400, {
      code: "GOOGLE_ID_TOKEN_REQUIRED"
    });
  }

  async verifyIdToken(idToken) {
    if (!this.fetch) {
      throw new HttpError("Google 토큰 검증을 위한 fetch를 사용할 수 없습니다.", 500, {
        code: "FETCH_UNAVAILABLE"
      });
    }

    const params = new URLSearchParams({ id_token: idToken });
    const response = await this.fetch(
      `https://oauth2.googleapis.com/tokeninfo?${params.toString()}`
    );

    if (!response.ok) {
      throw new HttpError("Google ID 토큰 검증에 실패했습니다.", 401, {
        code: "GOOGLE_TOKEN_INVALID"
      });
    }

    const data = await response.json();
    if (this.clientId && data.aud !== this.clientId) {
      throw new HttpError("Google ID 토큰 audience가 일치하지 않습니다.", 401, {
        code: "GOOGLE_TOKEN_AUDIENCE_MISMATCH"
      });
    }

    return normalizeProfile(data);
  }
}

function normalizeProfile(profile) {
  const email = String(profile.email || "").trim().toLowerCase();

  if (!email) {
    throw new HttpError("Google 프로필에 이메일이 없습니다.", 400, {
      code: "GOOGLE_EMAIL_REQUIRED"
    });
  }

  return {
    googleSub: profile.sub || profile.googleSub || null,
    email,
    nickname: profile.name || profile.nickname || email.split("@")[0],
    profileImage: profile.picture || profile.profileImage || null
  };
}

module.exports = { GoogleAuthService, normalizeProfile };
