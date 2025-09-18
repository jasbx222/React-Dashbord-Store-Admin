import { Edit, EyeIcon, Trash2 } from "lucide-react";
import { useState, type JSX } from "react";
import { Link } from "react-router-dom";

type Category = {
  id: number;
  name: string;
  image?: string;
  parent?: Category | null;
  children?: Category[];
};

interface TableProps {
  data: Category[];
  handleDelete?: (id: number) => void;
  openModal?: (row: Category) => void;
  itemsPerPage?: number;
}

const Table: React.FC<TableProps> = ({
  data,
  handleDelete,
  openModal,
  itemsPerPage = 6,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
const renderRows = (categories: Category[], level = 0): JSX.Element[] => {
  return categories.flatMap((cat) => {
    const row: JSX.Element = (
      <tr key={cat.id} className="border-b hover:bg-gray-50">
        <td className="py-3 px-6">
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            "-"
          )}
        </td>
        <td className="py-3 px-6 font-semibold text-[#4329fc]">
          <span style={{ paddingLeft: `${level * 20}px` }}>
            {level > 0 ? "└ " : ""}
            {cat.name}
          </span>
        </td>
        <td className="py-3 px-6 flex justify-center gap-2">
          {openModal && (
            <button
              onClick={() => openModal(cat)}
              className="p-2 bg-purple-50 text-purple-700 rounded-lg shadow hover:bg-purple-100 transition"
            >
              <Edit size={18} />
            </button>
          )}
          {handleDelete && (
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 bg-red-50 text-red-600 rounded-lg shadow hover:bg-red-100 transition"
            >
              <Trash2 size={18} />
            </button>
          )}
          <Link
            to={`/categories/${cat.id}`}
            className="p-2 bg-blue-50 text-blue-700 rounded-lg shadow hover:bg-blue-100 transition"
          >
            <EyeIcon size={18} />
          </Link>
        </td>
      </tr>
    );

    const childrenRows = cat.children ? renderRows(cat.children, level + 1) : [];
    return [row, ...childrenRows];
  });
};


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-start">الصورة</th>
            <th className="py-3 px-6 text-start">الاسم</th>
            <th className="py-3 px-6 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>{renderRows(paginatedData)}</tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                page === currentPage
                  ? "bg-[#4329fc] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Table;
