import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ImagePlus, X } from "lucide-react";
import { artisanService } from "../services/artisanService";
import { categoryService } from "../services/categoryService";
import { regionService } from "../services/regionService";
import { getErrorMessage } from "../services/errorMessage";
import type { Category, OwnedShop, OwnedShopImage, Region, ShopFormFields } from "../types";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { ShopLocationPicker } from "../components/ShopLocationPicker";
import { WeeklyHoursPicker, type WeeklyHoursEntry } from "../components/WeeklyHoursPicker";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FIELDS: ShopFormFields = {
  name: "",
  description: "",
  story: "",
  latitude: 0,
  longitude: 0,
  address: "",
  categoryId: 0,
  regionId: null,
  phoneNumber: "",
  email: "",
  instagramHandle: "",
  website: "",
  openingHours: "",
  structuredHoursJson: null,
  imageUrls: [],
};

function parseHours(json: string | null): WeeklyHoursEntry[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function EditShopPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const isEditing = shopId !== undefined;

  const [existingShop, setExistingShop] = useState<OwnedShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  const [fields, setFields] = useState<ShopFormFields>(EMPTY_FIELDS);
  const [hoursEntries, setHoursEntries] = useState<WeeklyHoursEntry[]>([]);
  // Editing: images already saved on the shop (each deletable individually).
  const [existingImages, setExistingImages] = useState<OwnedShopImage[]>([]);
  // Creating: photos uploaded so far, held as bare URLs until the shop
  // itself is created and these get attached via AddRequest.imageUrls.
  const [newPhotoUrls, setNewPhotoUrls] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const shopPromise = isEditing ? artisanService.getShop(Number(shopId)) : Promise.resolve(null);

    Promise.all([shopPromise, categoryService.getAll(), regionService.getAll()])
      .then(([shop, categoryList, regionList]) => {
        if (cancelled) return;
        setCategories(categoryList);
        setRegions(regionList);

        if (shop) {
          setExistingShop(shop);
          setExistingImages(shop.images);
          setHoursEntries(parseHours(shop.structuredHoursJson));
          setFields({
            name: shop.name,
            description: shop.description,
            story: shop.story,
            latitude: shop.latitude,
            longitude: shop.longitude,
            address: shop.address,
            categoryId: shop.categoryId,
            regionId: shop.regionId,
            phoneNumber: shop.phoneNumber,
            email: shop.email,
            instagramHandle: shop.instagramHandle,
            website: shop.website ?? "",
            openingHours: shop.openingHours,
            structuredHoursJson: shop.structuredHoursJson,
            imageUrls: [],
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFormError(getErrorMessage(err, "Could not load shop data."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopId, isEditing]);

  function update<K extends keyof ShopFormFields>(key: K, value: ShopFormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!fields.name.trim()) nextErrors.name = "Shop name is required";
    if (!fields.description.trim()) nextErrors.description = "Description is required";
    if (!fields.categoryId) nextErrors.categoryId = "Choose a category";
    if (fields.email && !EMAIL_PATTERN.test(fields.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploadingImage(true);
    try {
      if (isEditing && existingShop) {
        const response = await artisanService.uploadShopImage(existingShop.id, file);
        setExistingImages((current) => [...current, { id: response.id, url: response.url }]);
      } else {
        const url = await artisanService.uploadShopImageStandalone(file);
        setNewPhotoUrls((current) => [...current, url]);
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not upload image."));
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!existingShop) return;
    setDeletingImageId(imageId);
    try {
      await artisanService.deleteShopImage(existingShop.id, imageId);
      setExistingImages((current) => current.filter((img) => img.id !== imageId));
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not remove this photo."));
    } finally {
      setDeletingImageId(null);
    }
  }

  function removeNewPhoto(url: string) {
    setNewPhotoUrls((current) => current.filter((u) => u !== url));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    setSubmittedMessage(null);

    if (!validate()) return;

    const payload: ShopFormFields = {
      ...fields,
      structuredHoursJson: hoursEntries.length > 0 ? JSON.stringify(hoursEntries) : null,
      imageUrls: newPhotoUrls,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && existingShop) {
        await artisanService.updateShop(existingShop.id, payload);
        setSubmittedMessage("Your shop has been updated.");
        setTimeout(() => navigate("/artisan/dashboard"), 1200);
      } else {
        const response = await artisanService.createShop(payload);
        setSubmittedMessage(
          response.message ||
            "Your shop has been submitted for review and will be visible to visitors once approved, usually within 2-3 business days.",
        );
        setTimeout(
          () =>
            navigate(`/artisan/shops/${response.id}/membership`, {
              state: { note: "Choose your plan to get started" },
            }),
          2000,
        );
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save your shop."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/70 bg-white/70 text-primary-900 backdrop-blur-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">
          {isEditing ? "Edit Shop Profile" : "Create Your Shop"}
        </h1>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-4 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-lg"
          >
            {!isEditing && (
              <p className="rounded-lg bg-secondary-100 px-3 py-2 text-xs text-secondary-900">
                New shops are reviewed by our team before they go live -
                usually within 2-3 business days.
              </p>
            )}

            <TextField
              id="name"
              label="Shop name"
              value={fields.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                id="description"
                value={fields.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              />
              {errors.description && (
                <p className="text-xs text-nosija-red-700">{errors.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="story" className="text-sm font-medium text-text-primary">
                Story
              </label>
              <textarea
                id="story"
                value={fields.story}
                onChange={(e) => update("story", e.target.value)}
                rows={4}
                placeholder="Tell visitors about your craft and its history"
                className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="categoryId" className="text-sm font-medium text-text-primary">
                Category
              </label>
              <select
                id="categoryId"
                value={fields.categoryId || ""}
                onChange={(e) => update("categoryId", Number(e.target.value))}
                className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-nosija-red-700">{errors.categoryId}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="regionId" className="text-sm font-medium text-text-primary">
                Region (optional)
              </label>
              <select
                id="regionId"
                value={fields.regionId ?? ""}
                onChange={(e) =>
                  update("regionId", e.target.value ? Number(e.target.value) : null)
                }
                className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              >
                <option value="">Not set</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name.split(" - ")[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Location</label>
              <ShopLocationPicker
                latitude={fields.latitude}
                longitude={fields.longitude}
                onChange={(latitude, longitude) => {
                  setFields((current) => ({ ...current, latitude, longitude }));
                }}
              />
            </div>

            <TextField
              id="address"
              label="Address"
              value={fields.address}
              onChange={(e) => update("address", e.target.value)}
            />

            <TextField
              id="phoneNumber"
              label="Phone"
              value={fields.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={fields.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
            />
            <TextField
              id="website"
              label="Website"
              value={fields.website}
              onChange={(e) => update("website", e.target.value)}
            />
            <TextField
              id="instagramHandle"
              label="Instagram handle"
              value={fields.instagramHandle}
              onChange={(e) => update("instagramHandle", e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="openingHours" className="text-sm font-medium text-text-primary">
                Opening hours (short summary)
              </label>
              <input
                id="openingHours"
                value={fields.openingHours}
                onChange={(e) => update("openingHours", e.target.value)}
                placeholder="e.g. Mon-Sat 9:00-18:00"
                className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              />
              <p className="text-xs text-text-secondary">
                Shown as text on your shop page. Set exact hours below so visitors also see
                whether you're open right now.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Weekly hours</label>
              <WeeklyHoursPicker entries={hoursEntries} onChange={setHoursEntries} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">Photos</p>
              <div className="flex flex-wrap gap-2.5">
                {isEditing
                  ? existingImages.map((image) => (
                      <div key={image.id} className="relative h-16 w-16 overflow-hidden rounded-xl bg-primary-100">
                        <img src={image.url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                          disabled={deletingImageId === image.id}
                          aria-label="Remove photo"
                          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-50"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  : newPhotoUrls.map((url) => (
                      <div key={url} className="relative h-16 w-16 overflow-hidden rounded-xl bg-primary-100">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(url)}
                          aria-label="Remove photo"
                          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border-default text-text-secondary">
                  {isUploadingImage ? (
                    "..."
                  ) : (
                    <>
                      <ImagePlus size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </label>
              </div>
            </div>

            {formError && (
              <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
                {formError}
              </p>
            )}
            {submittedMessage && (
              <p className="rounded-lg bg-secondary-100 px-3 py-2 text-sm text-secondary-900">
                {submittedMessage}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Submit for review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
