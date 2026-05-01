import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, products, blogs } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

const currency = import.meta.env.VITE_CURRENCY;
axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
axios.defaults.withCredentials = true;

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorite, setFavorite] = useState([]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(false);
        return;
      }
      const { data } = await axios.get("/api/auth/is-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUser(true);
      } else {
        setUser(false);
      }
    } catch (error) {
      setUser(false);
    }
  };

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (data.success) {
        setAdmin(true);
      } else {
        setAdmin(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      setAdmin(null);
      localStorage.removeItem("token");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/all");
      if (data.success) {
        const dbNames = data.categories.map((c) => c.name);
        const filtered = categories.filter((c) => !dbNames.includes(c.name));
        setCategoriesData([...data.categories, ...filtered]);
      } else {
        setCategoriesData(categories);
      }
    } catch (error) {
      setCategoriesData(categories);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/all");
      if (data.success) {
        const dbNames = data.products.map((p) => p.name);
        const staticFiltered = products
          .filter((p) => !dbNames.includes(p.name))
          .map((p) => ({
            ...p,
            category:
              typeof p.category === "string"
                ? { name: p.category }
                : p.category,
          }));
        setProductsData([...data.products, ...staticFiltered]);
      } else {
        setProductsData(
          products.map((p) => ({
            ...p,
            category:
              typeof p.category === "string"
                ? { name: p.category }
                : p.category,
          })),
        );
      }
    } catch (error) {
      setProductsData(
        products.map((p) => ({
          ...p,
          category:
            typeof p.category === "string" ? { name: p.category } : p.category,
        })),
      );
    }
  };

  const fetchBlogs = async () => {
    setBlogsData(blogs);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const newCart = structuredClone(prev);
      const existingProduct = newCart.find((item) => item._id === product._id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        newCart.push({ ...product, quantity: 1 });
      }
      toast.success("Product added to cart");
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = structuredClone(prev);
      const existingProduct = newCart.find((item) => item._id === id);
      if (existingProduct.quantity === 1) {
        return newCart.filter((item) => item._id !== id);
      } else {
        existingProduct.quantity -= 1;
      }
      return newCart;
    });
  };

  const addToFavorite = (product) => {
    setFavorite((prev) => {
      const newFavs = structuredClone(prev);
      if (!newFavs.find((item) => item._id === product._id)) {
        newFavs.push(product);
        toast.success("Product added to favorite");
      } else {
        toast.error("Product already added to favorite");
      }
      return newFavs;
    });
  };

  const removeFromFavorite = (id) => {
    setFavorite((prev) => {
      toast.success("Product removed from favorite");
      return prev.filter((item) => item._id !== id);
    });
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.offerPrice * item.quantity,
      0,
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchBlogs();
    checkAuth();
    checkAdmin();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    categoriesData,
    productsData,
    currency,
    blogsData,
    addToCart,
    removeFromCart,
    cart,
    favorite,
    addToFavorite,
    removeFromFavorite,
    getCartTotal,
    admin,
    setAdmin,
    loading,
    setLoading,
    axios,
    fetchCategories,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
