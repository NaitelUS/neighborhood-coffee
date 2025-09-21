import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus";
import NotFound from "@/pages/not-found";
import AdminOrders from "@/pages/AdminOrders";




function Router() {
  return (
    <Switch>
      <Route path="/" component={OrderPage} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/order-status/:id" component={OrderStatus} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/order-status" component={OrderStatus} />
      {/* Fallback to 404 */}
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
