import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  navItems: { title: string; to: string; display: string[] }[];
}

/**
 * The Footer will display any and all navItems with the `footer` display tag, finally putting the Copywright information
 *   at the bottom with json version at the end.
 * @param props (navItems)
 * @returns The layout of the Footer
 */
export default function Footer(props: Props) {
  const [version, setVersion] = React.useState("");

  //TODO: Currently, this version.json is the factory's instead of the front ends? Probably because it uses fetch. I'll need to look into this more
  React.useEffect(() => {
    fetch("/version.json")
      .then((response) => response.json())
      .then((data) => setVersion(data.version));
  }, []);

  return (
    <footer className="m-8 flex justify-center">
      <div className="container border-t-2 border-gray-200 max-w-3xl">
        <nav className="-mb-0.5 flex space-x-6 justify-between">
          {props.navItems.map(
            (item) =>
              item.display.includes("footer") && (
                <NavLink
                  key={item.title}
                  className=" py-4 px-1 inline-flex items-center gap-2 text-sm whitespace-nowrap text-gray-200 hover:text-orange-600 focus:text-orange-600"
                  to={item.to}
                >
                  {item.title}
                </NavLink>
              )
          )}
        </nav>
        <p className="text-sm text-center italic text-gray-400">
          © 2024 JWT Pizza LTD. All rights reserved. Version: {version}
        </p>
      </div>
    </footer>
  );
}
