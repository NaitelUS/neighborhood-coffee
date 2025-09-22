// src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrderPage from "@/pages/OrderPage";
import NotFound from "@/pages/not-found";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus"; // 👈 import nuevo

function Router() {
  return (
    <Switch>
      <Route path="/" component={OrderPage} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/order-status/:id" component={OrderStatus} /> {/* 👈 nueva ruta */}
      {/* Fallback a 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
