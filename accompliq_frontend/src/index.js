import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import AuthInitializer from "./Components/auth/AuthInitializer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// ✅ Load Stripe public key from .env
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </Elements>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
