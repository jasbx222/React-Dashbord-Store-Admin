import { useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import Loading from "../../components/ui/Loading";

type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
  price_after: number;
  is_offer: boolean;
  offer_name: string;
};

type CategoryData = {
  id: number;
  name: string;
  image: string;
  products_count: number;
  products: Product[];
  children?: CategoryData[];
  parent?: {
    id: number;
    name: string;
  };
};

type CategoryResponse = {
  data: CategoryData;
};

export default function CategoryDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: categories } = useGetData<CategoryResponse>(`categories/${id}`);
  const category = categories?.data;

  if (!category) return <Loading />;

  // دالة لجمع كل المنتجات من القسم وأقسامه الفرعية (لو موجودة)
  const getAllProducts = (cat: CategoryData): Product[] => {
    let products: Product[] = [...(cat.products || [])];
    if (cat.children && cat.children.length) {
      cat.children.forEach((child) => {
        products = products.concat(getAllProducts(child));
      });
    }
    return products;
  };

  const allProducts = getAllProducts(category);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* القسم */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden mb-8">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#4329fc]">{category.name}</h1>
          {category.parent && (
            <p className="text-gray-500 mt-1">القسم الأب: {category.parent.name}</p>
          )}
          <p className="text-gray-600 mt-2">
            عدد المنتجات: {allProducts.length}
          </p>
        </div>
      </div>

      {/* المنتجات */}
      <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
      {allProducts.length === 0 ? (
        <p className="text-gray-500">ماكو منتجات بهذا القسم.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-105 duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.description}</p>

                <div className="flex justify-between items-center mt-2">
                  {product.is_offer ? (
                    <div>
                      <span className="line-through text-gray-400 mr-2">
                        {product.price} د.ع
                      </span>
                      <span className="text-green-600 font-bold">
                        {product.price_after} د.ع
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-700 font-bold">
                      {product.price} د.ع
                    </span>
                  )}
                  {product.is_offer && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {product.offer_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
