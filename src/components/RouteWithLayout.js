import React from 'react';
import {Route} from "react-router-dom";
import PageNotFound from "./PageNotFound";

const RouteWithLayout = props => {
  const {layout: Layout, component: Component, shouldRender = true, ...rest} = props;

  return (
    <Route {...rest}>
      {
        shouldRender ? matchProps => (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          ) :
          <PageNotFound/>
      }
    </Route>
  );
};

export default RouteWithLayout;