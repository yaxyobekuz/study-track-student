import http from "@/shared/api/http";

export const premiumAPI = {
  getStatus:            ()              => http.get("/api/premium/status"),
  buyPremium:           ()              => http.post("/api/premium/buy"),
  getAvailableEmojis:   ()              => http.get("/api/premium/emojis"),
  setEmojiBadge:        (emojiId)       => http.put("/api/premium/emoji-badge", { emojiId }),
  setDisplayName:       (displayName)   => http.put("/api/premium/display-name", { displayName }),
  setNameColor:         (nameColor)     => http.put("/api/premium/name-color", { nameColor }),
  uploadProfilePicture: (formData)      =>
    http.post("/api/premium/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProfilePicture: ()              => http.delete("/api/premium/profile-picture"),
};
