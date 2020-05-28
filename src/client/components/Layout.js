import React from "react";
import {Helmet} from 'react-helmet';
import Header from "./Header";

export default ({children}) => {
    return (
        <div>
            <Helmet titleTemplate="%s | Becalm"/>
            <Header/>
            <main>
                <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

