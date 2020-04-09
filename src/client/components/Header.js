import React from "react";
import {Link} from "react-router-dom";
import {Logo} from "./Icons";

export default () => (
    <header className="bg-white shadow">
        <div className="flex items-center px-8 py-4 bg-gray-800">
            <Link to="/" className="text-white flex items-center">
                <Logo className="w-8 fill-current"/>
                <span className="ml-2 text-xl">Becalm</span>
            </Link>
        </div>
    </header>
)