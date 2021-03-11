import './App.css';
import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import LoginView from "./Views/LoginView";
import Layout from './Components/Layout/Layout'

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Switch>
                <Route path={"/login"} component={() => <LoginView />} />
                <Route path={"/layout"} component={() => <Layout/> } />
                <Redirect to={"/login"} />
            </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
