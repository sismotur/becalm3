import React from "react";
import "../styles/app.css"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Patient from "../pages/Patient";
import Layout from "../components/Layout";

export default () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path="/" render={props => (
                    <Layout {...props}>
                        <Dashboard {...props}/>
                    </Layout>
                )}/>

                <Route path="/patient/:id" render={props => (
                    <Layout {...props}>
                        <Patient {...props}/>
                    </Layout>
                )}/>

                <Redirect from="*" to="/"/>
            </Switch>
        </div>
    </BrowserRouter>
)