import React, { createContext, useReducer, useContext, useEffect } from "react";

// Constants for action types
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const SET_LOADING = "SET_LOADING";

const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isLoggedIn: true };
    case LOGOUT:
      return { ...state, isLoggedIn: false };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedLoginStatus = localStorage.getItem("isLoggedIn");

      if (storedLoginStatus === "true") {
        dispatch({ type: LOGIN });
      } else {
        dispatch({ type: LOGOUT });
      }

      dispatch({ type: SET_LOADING, payload: false });
    };

    checkLoginStatus();
  }, []);

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    dispatch({ type: LOGIN });
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {!state.isLoading ? children : null}
    </AuthContext.Provider>
  );
};
