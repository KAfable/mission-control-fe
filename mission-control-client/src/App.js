import React, { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";
import "./styles/index.scss";
import Registration from "./components/auth/Registration.js";
import Login from './components/auth/Login';
import Bad from './components/layout/Bad';
import DashboardHome from "./components/dashboard/admin-dashboard/DashboardHome";
import embedAnalytics from './utils/embedAnalytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    embedAnalytics();
  }, [location]);

  return (
    <Layout>
      <Switch>
        <PrivateRoute path="/" exact>{localStorage.getItem('token')? <Redirect to={{pathname: `/dashboard/${localStorage.getItem('user')}`}}/> : <Redirect to="/login" />}</PrivateRoute>
        <Route path="/register" component={Registration} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/dashboard/:id" component={DashboardHome} />
        <Route component={Bad}/>
      </Switch>
    </Layout>
  );
}

export default App;