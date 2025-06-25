import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Categorie from "./pages/categorie";
import Customers from "./pages/customers";
import Produit from "./pages/Produit";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Orders from "./pages/orders";
import Admins from "./pages/Admins";
import Collections from "./pages/collections";
import ProtectedRoute from "./Protected"; // Import the ProtectedRoute component
import Accessories from "./pages/Acc";
import ordersEx from "./pages/ordersEx";
import Case from "./pages/Case";

function App() {
  return (
    <div className="App">
      <Switch>
        {/* Public Routes */}
        <Route path="/login" exact component={SignUp} />
        {/* Protected Routes */}
        <Main>
          <ProtectedRoute exact path="/dashboard" component={Home} />
          <ProtectedRoute exact path="/tables" component={Tables} />
          <ProtectedRoute exact path="/admins" component={Admins} />
          <ProtectedRoute exact path="/categorie" component={Categorie} />
          <ProtectedRoute exact path="/collections" component={Collections} />
          <ProtectedRoute exact path="/orders" component={Orders} />
          <ProtectedRoute exact path="/ordersEx" component={ordersEx} />
          <ProtectedRoute exact path="/Case" component={Case} />
          <ProtectedRoute exact path="/customers" component={Customers} />
          <ProtectedRoute exact path="/produit" component={Produit} />
          <ProtectedRoute exact path="/Accessories" component={Accessories} />
          <ProtectedRoute exact path="/billing" component={Billing} />
          <ProtectedRoute exact path="/rtl" component={Rtl} />
          <ProtectedRoute exact path="/profile" component={Profile} />

          {/* Redirect all other routes to /dashboard */}
          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
