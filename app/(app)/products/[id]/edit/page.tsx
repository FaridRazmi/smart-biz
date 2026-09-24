import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { toNumber } from "@/lib/format";

export const metadata = { title: "Edit Product — SmartBiz" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id: Number(id), userId: user.id },
  });
  if (!product) notFound();

  return (
    <ProductForm
      mode="edit"
      product={{
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        buyingPrice: toNumber(product.buyingPrice).toString(),
        sellingPrice: toNumber(product.sellingPrice).toString(),
      }}
    />
  );
}
