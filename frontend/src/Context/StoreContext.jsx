import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 50;

    // Add item to the cart
    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
        }));
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    // Remove item from the cart
    const removeFromCart = async (itemId) => {
        if (cartItems[itemId] > 1) {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] - 1
            }));
        } else {
            const { [itemId]: _, ...rest } = cartItems;
            setCartItems(rest);
        }
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    // Update cart item quantity directly
    const updateCartItemQuantity = async (itemId, newQuantity) => {
        if (newQuantity > 0) {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: newQuantity
            }));
        } else {
            const { [itemId]: _, ...rest } = cartItems;
            setCartItems(rest);
        }
        if (token) {
            await axios.post(url + "/api/cart/update", { itemId, quantity: newQuantity }, { headers: { token } });
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        return food_list.reduce((totalAmount, item) => {
            if (cartItems[item._id] > 0) {
                totalAmount += item.price * cartItems[item._id];
            }
            return totalAmount;
        }, 0);
    };

    // Fetch food list from API
    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };

    // Load cart data from the backend
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };

    // Initialize data
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
