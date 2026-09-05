import CategoryForm from '@/components/admin/CategoryForm';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  return (
    <div>
      <CategoryForm categoryId={parseInt(params.id)} />
    </div>
  );
}
