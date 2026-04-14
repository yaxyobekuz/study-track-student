// Router
import { useNavigate } from "react-router-dom";

// React
import { useEffect, useRef, useState } from "react";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { usersAPI } from "@/features/profile/api/users.api";
import { premiumAPI } from "@/features/premium/api/premium.api";

// Components
import Card from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/shadcn/button";
import BackHeader from "@/shared/components/layout/BackHeader";
import StudentAvatar from "@/shared/components/ui/StudentAvatar";
import InputField from "@/shared/components/ui/input/InputField";
import PremiumBuyModal from "@/features/premium/components/PremiumBuyModal";
import PremiumEmojiDisplay from "@/shared/components/ui/PremiumEmojiDisplay";
import EmojiSelectorModal from "@/features/premium/components/EmojiSelectorModal";

// Tanstack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Static data
import {
  NAME_COLOR_OPTIONS,
  NAME_COLOR_CLASS_MAP,
} from "@/shared/data/nameColors.data";

// Toast
import { toast } from "sonner";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [displayName, setDisplayName] = useState("");

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const { openModal } = useModal("emojiSelector");
  const { openModal: openPremiumModal } = useModal("premiumBuy");

  useEffect(() => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
    });
    setDisplayName(profile.displayName || "");
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (payload) => usersAPI.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/profile");
    },
  });

  const uploadPicMutation = useMutation({
    mutationFn: (formData) => premiumAPI.uploadProfilePicture(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profil rasm yuklandi");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Rasm yuklashda xatolik");
    },
  });

  const deletePicMutation = useMutation({
    mutationFn: () => premiumAPI.deleteProfilePicture(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profil rasm o'chirildi");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const setDisplayNameMutation = useMutation({
    mutationFn: (name) => premiumAPI.setDisplayName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Ko'rsatma ism saqlandi");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const setNameColorMutation = useMutation({
    mutationFn: (color) => premiumAPI.setNameColor(color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Ism rangi o'rnatildi");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateMutation.mutate({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    uploadPicMutation.mutate(formData);
    event.target.value = "";
  };

  const isPremium = profile?.premium?.isActive;
  const profilePictureUrl = profile?.profilePicture?.variants?.sm?.url || null;
  const currentColor = profile?.nameColor || null;

  return (
    <div className="min-h-screen pb-20 space-y-5 animate__animated animate__fadeIn">
      <BackHeader href="/profile" title="Profilni tahrirlash" />

      <div className="container space-y-4">
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            Profil ma'lumotlarini yuklab bo'lmadi
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Card title="Umumiy ma'lumotlar" className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Ism</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    placeholder="Ism"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Familiya</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    placeholder="Familiya"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </Card>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={updateMutation.isPending}
              >
                Saqlash
              </Button>
            </form>

            {/* Premium section */}
            {isPremium ? (
              <div className="space-y-4">
                {/* Profile picture */}
                <Card title="Profil rasm" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <StudentAvatar
                      size="lg"
                      isPremium
                      fallbackName={
                        profile?.fullName || profile?.firstName || ""
                      }
                      profilePictureUrl={profilePictureUrl}
                      emojiBadgeId={profile?.emojiBadgeId || null}
                    />

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={uploadPicMutation.isPending}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadPicMutation.isPending
                          ? "Yuklanmoqda..."
                          : "Rasm yuklash"}
                      </Button>
                      {profilePictureUrl && (
                        <Button
                          type="button"
                          variant="danger"
                          className="text-sm"
                          onClick={() => deletePicMutation.mutate()}
                          disabled={deletePicMutation.isPending}
                        >
                          O'chirish
                        </Button>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Card>

                {/* Emoji badge */}
                <Card title="Emoji badge" className="space-y-3">
                  <div className="flex items-center gap-3">
                    {profile?.emojiBadgeId ? (
                      <PremiumEmojiDisplay
                        emojiId={profile.emojiBadgeId}
                        className="size-10"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        ?
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => openModal("emojiSelector")}
                    >
                      Emoji tanlash
                    </Button>
                  </div>
                </Card>

                {/* Display name */}
                <Card title="Ko'rsatma ism (taxallus)" className="space-y-4">
                  <InputField
                    type="text"
                    maxLength={48}
                    label="Taxallus"
                    value={displayName}
                    placeholder="Taxallusingizni kiriting"
                    onChange={(e) => setDisplayName(e.target.value)}
                    description="Liderlar jadvalida haqiqiy ismingiz o'rniga ko'rsatiladi"
                  />

                  <Button
                    type="button"
                    className="w-full"
                    disabled={setDisplayNameMutation.isPending}
                    onClick={() => setDisplayNameMutation.mutate(displayName)}
                  >
                    Saqlash
                  </Button>
                </Card>

                {/* Name color */}
                <Card title="Ism rangi" className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    {NAME_COLOR_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.key}
                        onClick={() => setNameColorMutation.mutate(option.key)}
                        disabled={setNameColorMutation.isPending}
                        className={`flex flex-1 flex-col items-center gap-1 text-xs rounded-lg p-2 border-2 transition-colors ${
                          currentColor === option.key
                            ? "border-blue-500 bg-blue-50"
                            : "border-transparent hover:border-gray-200"
                        }`}
                      >
                        <span
                          className="size-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: option.hex }}
                        />
                        <span className={NAME_COLOR_CLASS_MAP[option.key]}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                    {currentColor && (
                      <button
                        type="button"
                        onClick={() => setNameColorMutation.mutate(null)}
                        disabled={setNameColorMutation.isPending}
                        className="flex flex-col items-center gap-1 text-xs rounded-lg p-2 border-2 border-transparent hover:border-gray-200"
                      >
                        <span className="size-6 rounded-full border border-gray-200 bg-gray-100" />
                        <span className="text-gray-500">Standart</span>
                      </button>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-yellow-800">
                  Premium funksiyalar
                </p>
                <p className="text-xs text-yellow-700">
                  Profil rasm, emoji badge, ko'rsatma ism va ism rangini sozlash
                  uchun MBSI Premium oling.
                </p>
                <Button
                  type="button"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => openPremiumModal("premiumBuy")}
                >
                  Premium olish — 100 tanga
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <EmojiSelectorModal />
      <PremiumBuyModal />
    </div>
  );
};

export default ProfileEditPage;
