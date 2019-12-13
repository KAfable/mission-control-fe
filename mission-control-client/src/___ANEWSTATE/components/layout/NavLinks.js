import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import NavLinksLoggedIn from './NavLinksLoggedIn';
import NavLinksLoggedOut from './NavLinksLoggedOut';

const NavLinks = () => {
  const token = localStorage.getItem("okta-token-storage")

  return (
    <>
    {token ? <NavLinksLoggedIn /> : <NavLinksLoggedOut />}
    </>
  );
};

export default NavLinks;
