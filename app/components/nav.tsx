import { NavLink } from "@remix-run/react";
import { useState } from "react";

const CONTACT_EMAIL = "team@electrifydc.org";

function Navbar() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuToggled(!isMobileMenuToggled);
  };

  const NotificationBanner = () => {
    return (
      <div className="bg-zinc-700 py-2">
        <div className="text-center font-semibold">
          Find qualified contractors for your electrification project.{" "}
          <a
            className="text-sky-500 underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            Contact us
          </a>{" "}
          for support.
        </div>
      </div>
    );
  };
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-repower-dark-blue text-white">
      <NotificationBanner />
      <div className="flex flex-wrap items-center justify-items-center px-6 py-4 md:flex-nowrap">
        <NavLink to="/">
          <img
            src="img/electrifydmvwhitehorizontal.png"
            alt="Electrify DMV logo"
            className="inline-block w-[250px] grow md:mr-10 md:w-[300px] md:grow-0 lg:w-[350px]"
          />
        </NavLink>
        <div className="min-w-4 grow"></div>
        <div
          className="cursor-pointer md:hidden"
          onClick={toggleMobileMenu}
          onKeyDown={toggleMobileMenu}
          role="presentation"
        >
          <i
            className={`fa fa-2x aria-hidden='true' ${isMobileMenuToggled ? "fa-times" : "fa-bars"}`}
          ></i>
        </div>
        <div
          className={`mt-4 grow basis-full md:mt-0 md:inline-block md:grow-0 md:basis-auto ${isMobileMenuToggled ? "inline-block" : "hidden"}`}
          onClick={() => setIsMobileMenuToggled(false)}
          onKeyDown={() => setIsMobileMenuToggled(false)}
          role="presentation"
        >
          <ul className="flex flex-col items-center justify-end gap-x-8 gap-y-4 text-nowrap text-center text-lg md:flex-row [&>li:hover]:text-gray-300 [&>li]:inline-block">
            <li className="inline-block">
              <NavLink
                to="/contractors"
                className={({ isActive, isPending }) =>
                  isPending ? "border-b-4" : isActive ? "border-b-4" : ""
                }
              >
                Find Contractors
              </NavLink>
            </li>
            <li className="inline-block">
              <a
                href="https://electrifydc.org"
                className="hover:text-gray-300"
              >
                Home
              </a>
            </li>
            <li className="inline-block">
              <a
                href="https://electrifydc.org/about"
                className="hover:text-gray-300"
              >
                About
              </a>
            </li>
            <li className="inline-block">
              <a
                href="https://electrifydc.org/resources"
                className="hover:text-gray-300"
              >
                Resources
              </a>
            </li>
            <li className="align-middle">
              <a href="https://electrifydc.org/contact">
                <button className="rounded bg-green-700 px-6 py-2 hover:bg-green-800">
                  Contact
                </button>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
