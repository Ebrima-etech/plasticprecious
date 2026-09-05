import ProductForm from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <div>
      <ProductForm productId={parseInt(params.id)} />
    </div>
  );
}
