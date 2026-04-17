import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { BetSlipProvider } from "@/contexts/BetSlipContext";

import Index from "./pages/Index";
import Sports from "./pages/Sports";
import Live from "./pages/Live";
import Virtuals from "./pages/Virtuals";
import Casino from "./pages/Casino";
import Aviator from "./pages/Aviator";
import Basketball from "./pages/Basketball";
import Boxing from "./pages/Boxing";
import WatchLive from "./pages/WatchLive";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Promotions from "./pages/Promotions";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BetSlipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/live" element={<Live />} />
              <Route path="/virtuals" element={<Virtuals />} />
              <Route path="/casino" element={<Casino />} />
              <Route path="/aviator" element={<Aviator />} />
              <Route path="/basketball" element={<Basketball />} />
              <Route path="/boxing" element={<Boxing />} />
              <Route path="/watch" element={<WatchLive />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BetSlipProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
