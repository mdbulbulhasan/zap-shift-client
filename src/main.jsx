import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./Router/router.jsx";
import "aos/dist/aos.css";
import Aos from "aos";
import AuthProvider from "./context/AuthContext/AuthProvider.jsx";
import "leaflet/dist/leaflet.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

Aos.init();
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-[85%] mx-auto bg-white">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {" "}
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
