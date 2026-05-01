import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { Upload } from "lucide-react";

const AddCategory = () => {
  const { loading, navigate, setLoading, axios } = useContext(AppContext);
  const [formData, setFormData] = useState({ name: "", image: null });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData({ ...formData, image: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Not authenticated"); return; }

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      if (file) payload.append("image", file);

      const { data } = await axios.post("/api/category/add", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/admin/categories");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <form onSubmit={handleSubmit} className="max-w-md w-full flex flex-col gap-5">
        {preview && <img src={preview} alt="" className="w-1/2" />}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Category Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
          <input id="fileUpload" type="file" className="hidden" onChange={handleFileChange} required />
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary transition"
          >
            <Upload className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-gray-600 text-sm">{file ? file.name : "Click to upload image"}</span>
          </label>
        </div>
        <button type="submit" className="bg-primary text-white px-8 py-3 cursor-pointer rounded">
          {loading ? "Loading..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};
export default AddCategory;