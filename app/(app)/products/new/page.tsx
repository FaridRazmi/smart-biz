import ProductForm from "@/components/ProductForm";

export const metadata = { title: "New Product — SmartBiz" };
export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return <ProductForm mode="create" />;
}
