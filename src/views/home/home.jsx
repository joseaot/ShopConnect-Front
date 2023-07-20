import { useEffect, useState, useRef } from "react";
import ProductsContainer from "../../components/productsContainer/productsContainer";
import Carousel from "../../components/carousel/Carousel";
import Order from "../../components/Order/order";
import Filter from "../../components/Filter/Filter";
import { useDispatch } from "react-redux";
import { getProducts, getProductName } from "../../redux/actions";
import { useUser, useAuth } from "@clerk/clerk-react";
import { addUser } from "../../redux/actions";
import { Loader } from "../../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = ({ toggle }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [userAdded, setUserAdded] = useState(false);
  const dispatch = useDispatch();

  const { isSignedIn } = useUser();
  const userRef = useRef(null);

  const handleCloseModal = () => {
    closeModal();
  };

  const { accessToken } = useAuth();

  const user = useUser();

  const [showCarousel, setShowCarousel] = useState(true);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      // Simulación de tiempo de carga
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(getProducts());
      window.scrollTo(0, 0);
      setIsLoading(false); // Finaliza la carga
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    // Verificar si el mensaje ya fue mostrado previamente en esta sesión
    const isMessageShown = localStorage.getItem("userAddedMessageShown");

    if (!userAdded && isSignedIn && !isMessageShown) {
      // Mostrar el mensaje de toast solo la primera vez que se loguea
      toast.success("Mail has been registered!");
      localStorage.setItem("userAddedMessageShown", true); // Almacenar en LocalStorage que se mostró el mensaje
    }
  }, [isSignedIn, userAdded]);
  
  useEffect(() => {
    if (isSignedIn && !userAdded) {
      const userCreate = {
        name: user.user.fullName, 
        last_name: user.user.lastName,
        mail: user.user.primaryEmailAddress.emailAddress, 
        idUser: user.user.id,
      };
      dispatch(addUser(userCreate));
      setUserAdded(true); // Actualizar el estado para que no se llame addUser nuevamente
    }
  }, [isSignedIn, userAdded, dispatch, user.user]);

 const handleSearch = (name) => {
    setSearchName(name);
    if (name.trim() === "") {
      setShowCarousel(true);
      dispatch(getProducts());
    } else {
      setShowCarousel(false);
      dispatch(getProductName(name));
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {toggle && <Carousel />}
          <Order />
          <Filter />
          <ProductsContainer />
          <ToastContainer />
        </>
      )}
    </div>
  );

};

export default Home;
