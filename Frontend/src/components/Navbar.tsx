"use client";
import { navLists } from "../constants";
import { Link } from "react-router-dom";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        <Link to="/">
          <img
            src="/assets/images/CPlogo.png"
            alt="CreatorPilot"
            width={56}
            height={72}
            className="object-contain"
          />
        </Link>

        <div className="flex flex-1 justify-center max-sm:hidden">
          {navLists.map((nav) => (
            <div
              key={nav}
              className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
            >
              <Link to={`/${nav}`}>{nav}</Link>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
