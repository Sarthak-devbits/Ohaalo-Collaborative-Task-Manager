import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SingleBoard from "./pages/singleBoard/SingleBoard";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedComponent from "./components/protectedComponent/ProtectedComponent";
import { injectStore } from "./services/axios.ts";
injectStore(store);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedComponent>
                  <Index />
                </ProtectedComponent>
              }
            >
              <Route
                path="board"
                element={
                  <ProtectedComponent>
                    <SingleBoard />
                  </ProtectedComponent>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedComponent>
                    <Dashboard />
                  </ProtectedComponent>
                }
              />
              <Route
                path="task"
                element={
                  <ProtectedComponent>
                    <Dashboard />
                  </ProtectedComponent>
                }
              />
              <Route
                path="calender"
                element={
                  <ProtectedComponent>
                    <Dashboard />
                  </ProtectedComponent>
                }
              />
              {/* Add more child routes of workspace here */}
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
