import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { CircleX } from "lucide-react";
import toast from "react-hot-toast";

const AllCategories = () => {
  const { categoriesData, axios, fetchCategories } = useContext(AppContext);

  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`/api/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">All Categories</h1>
      <div className="mt-4 border border-gray-400 max-w-5xl mx-auto p-3">
        <div className="grid grid-cols-3 font-semibold text-gray-700">
          <div>Image</div>
          <div>Name</div>
          <div>Actions</div>
        </div>
        <hr className="w-full my-4 text-gray-200" />
        <ul>
          {categoriesData.map((item) => (
            <div key={item._id}>
              <div className="grid grid-cols-3 items-center mb-4">
                <div>
                  <img
                    src={`${import.meta.env.VITE_BASEURL}/uploads/${item.image}`}
                    alt=""
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p>{item.name}</p>
                <div className="flex items-center gap-5">
                  <p onClick={() => deleteCategory(item._id)} className="text-red-500 cursor-pointer">
                    <CircleX />
                  </p>
                </div>
              </div>
              <hr className="w-full text-gray-300" />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AllCategories;