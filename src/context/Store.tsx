import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

const initialState = {
  darkMode: false,
  search_query: "",
  cart: {
    cartItems: [],
  },
  userInfo: Cookies.get("userInfo")
    ? // @ts-ingore
      JSON.parse(Cookies.get("userInfo"))
    : null,
};

// @ts-ignore
export const Store = createContext();

function reducer(state: any, action: { type: any; payload: any }) {
  switch (action.type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      return { ...state, darkMode: false };
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: any) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: any) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    case "REMOVE_FROM_CART":
      const NewcartItems = state.cart.cartItems.filter(
        (item: any) => item._id !== action.payload._id
      );
      return { ...state, cart: { ...state.cart, cartItems: NewcartItems } };

    case "USER_LOGIN":
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      return { ...state, userInfo: null, cart: { cartItems: [] } };
    case "SET_SEARCH_QUERY":
      return { ...state, search_query: action.payload };
    default:
      return state;
  }
}

interface Props {
  children?: any;
}

export function StoreProvider(props: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
