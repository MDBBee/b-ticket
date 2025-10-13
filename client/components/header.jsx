import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = currentUser
    ? [{ label: 'Sign Out', href: '/auth/signout' }]
    : [
        { label: 'Sign Up', href: '/auth/signup' },
        { label: 'Sign In', href: '/auth/signin' },
      ];

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        🏡B-Tickets
      </Link>

      <div className="d-flex justify-content-end ">
        <ul className="nav d-flex align-items-center ">
          {links.map(({ label, href }) => {
            return (
              <li key={href} className="nav-item mx-2">
                <Link href={href}>{label}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
export default Header;
