import React from 'react';
import './Layout.css';
import PropTypes from 'prop-types';

/**
 * Layout component that serves as a wrapper for the main content of the application.
 * It applies a consistent layout style to its children components.
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} Rendered Layout component.
 */

const Layout = ({ children }) => {
  return <main className="layout-container">{children}</main>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
