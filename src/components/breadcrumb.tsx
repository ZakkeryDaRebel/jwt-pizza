import React from "react";
import { NavLink } from "react-router-dom";
import { HouseIcon, GreaterThanIcon } from "../icons";

interface Props {
  location: string;
}

/**
 * The Breadcrumb component is the history tracker of the application, allowing us to see where we've been,
 *   allowing the forward and backward buttons to go through these views instead of a different website.
 * The Breadcrumb trail starts at home, and has any other path follow, each path separated by a ">"
 * @param props (location: string)
 * @returns
 */
export default function Breadcrumb(props: Props) {
  let currentPath = "";
  const paths = props.location.split("/").map((path) => {
    currentPath += "/" + path;
    return (
      <li
        key={path}
        className="inline-flex items-center text-sm font-semibold text-gray-800 truncate"
        aria-current="page"
      >
        <GreaterThanIcon />

        <NavLink
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
          to={currentPath}
        >
          {path}
        </NavLink>
      </li>
    );
  });
  return (
    <ol className="flex items-center whitespace-nowrap py-2 px-4 bg-gray-300">
      <li className="inline-flex items-center">
        <NavLink
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"
          to="/"
        >
          <span className="mx-1">
            <HouseIcon />
          </span>
          home
        </NavLink>
      </li>
      {location && paths}
    </ol>
  );
}
