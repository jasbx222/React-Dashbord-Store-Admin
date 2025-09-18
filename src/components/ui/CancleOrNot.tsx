type Props = {
  onClose: () => void;
};

const CancleOrSave = ({ onClose }: Props) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
      >
        إلغاء
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-gradient-to-b from-[#4329fc]  to-[#4229fc80] text-white rounded-lg hover:scale-105 transition-transform"
      >
        حفظ
      </button>
    </div>
  );
};

export default CancleOrSave;
