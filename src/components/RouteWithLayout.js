import React from 'react';
import Denied from '../views/Error/Denied';
import Route from "react-router-dom";

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, shouldRender = true, ...rest } = props;

  return (
    <Route {...rest}>
      {
        shouldRender ? matchProps => (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          ):
          <Denied />
      }
    </Route>
  );
};

export default RouteWithLayout;