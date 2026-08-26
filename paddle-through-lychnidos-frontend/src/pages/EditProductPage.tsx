import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ImagePlus } from "lucide-react";
import { artisanService } from "../services/artisanService";
import { productService } from "../services/productService";
import { productVideoService } from "../services/productVideoService";
import { getErrorMessage } from "../services/errorMessage";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";

export function EditProductPage() {
  const { shopId, id } = useParams<{ shopId: string; id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined && id !== "new";

  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!shopId) return;
    let cancelled = false;

    const productPromise = isEditing
      ? productService.getById(Number(id)).then((product) => {
          if (cancelled) return;
          setName(product.name);
          setDescription(product.description);
          setPrice(String(product.price));
          setImageUrl(product.imageUrl);
          // GET /api/products/{id} doesn't return existing ProductVideo
          // records, so there's no way to pre-fill this from the product
          // response - videoUrl starts empty on edit, same as create.
        })
      : Promise.resolve();

    productPromise
      .catch((err) => {
        if (!cancelled) {
          setFormError(getErrorMessage(err, "Could not load product data."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopId, id, isEditing]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await artisanService.uploadProductImage(file);
      setImageUrl(url);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not upload image."));
    } finally {
      setIsUploadingImage(false);
    }
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Product name is required";
    if (!description.trim()) nextErrors.description = "Description is required";
    const numericPrice = Number(price);
    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      nextErrors.price = "Enter a valid price";
    }
    if (!imageUrl) nextErrors.imageUrl = "Upload a product image";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    if (!validate() || !shopId) return;

    setIsSubmitting(true);
    try {
      let productId = isEditing ? Number(id) : null;

      if (isEditing && productId) {
        await productService.update(productId, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          imageUrl,
        });
      } else {
        const created = await productService.create({
          shopId: Number(shopId),
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          imageUrl,
        });
        productId = created.id;
      }

      if (videoUrl.trim() && productId) {
        await productVideoService.create(productId, videoUrl.trim());
      }

      navigate(`/artisan/shops/${shopId}/products`);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save this product."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-4 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">Product image</p>
              <div className="h-32 w-32 overflow-hidden rounded-xl bg-primary-100">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <label className="flex h-full w-full cursor-pointer items-center justify-center text-text-secondary">
                    {isUploadingImage ? (
                      "..."
                    ) : (
                      <>
                        <ImagePlus size={22} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </label>
                )}
              </div>
              {imageUrl && (
                <label className="mt-2 inline-block cursor-pointer text-xs font-semibold text-primary-800 underline">
                  Change image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              {errors.imageUrl && (
                <p className="mt-1 text-xs text-nosija-red-700">{errors.imageUrl}</p>
              )}
            </div>

            <TextField
              id="name"
              label="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              />
              {errors.description && (
                <p className="text-xs text-nosija-red-700">{errors.description}</p>
              )}
            </div>

            <TextField
              id="price"
              label="Price (MKD)"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
            />

            <TextField
              id="videoUrl"
              label="Video URL (optional)"
              placeholder="e.g. a before-and-after craft video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />

            {formError && (
              <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add product"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
