import React from 'react';
import { LoginBtn, SignupBtn } from './buttons/buttons';

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-[5rem] shadow-md">
      <div className="text-xl sm:text-3xl tracking-tight font-bold">
        Loyalty Program
      </div>
      <div>
        <ul className="flex gap-4">
          <li>
            <LoginBtn />
          </li>
          <li>
            <SignupBtn />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
