import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { ThreeDots } from "react-bootstrap-icons";
import { Route } from 'react-router-dom';


export const ProtectedRoute = ({ component, props }) => {
    const Component = withAuthenticationRequired(component, {
      onRedirecting: () => <ThreeDots />,
    });
  
    return <Component {...props} />;
  };