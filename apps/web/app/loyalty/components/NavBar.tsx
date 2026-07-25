import React, { useEffect } from 'react';
import { LoginBtn, SignupBtn } from './buttons/buttons';
import { getCookieValue } from '@/services/getCookieValue';
import { LogoutBtn } from '@/app/loyalty-admin/components/buttons/buttons';

const NavBar = () => {
  const [name, setName] = React.useState<string | null>(null);

  useEffect(() => {
    const token = getCookieValue('token');
    if (token) {
      const name = localStorage.getItem('username');
      setName(name);
    }
  }, []);

  return (
    <nav className="flex justify-between items-center py-4 px-[5rem] shadow-md">
      <div className="text-xl sm:text-3xl tracking-tight font-bold">
        Loyalty Program
      </div>
      <div>
        {!name ? (
          <ul className="flex gap-4">
            <li>
              <LoginBtn />
            </li>
            <li>
              <SignupBtn />
            </li>
          </ul>
        ) : (
          <div className="flex items-center gap-4">
            <p className="font-medium text-lg">{name}</p>
            <LogoutBtn />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
