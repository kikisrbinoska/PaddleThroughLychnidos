import { useParams } from "react-router-dom";

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-2xl font-extrabold text-primary-900">
        Shop Detail
      </h1>
      <p className="text-text-secondary">Shop ID: {id}</p>
    </div>
  );
}
