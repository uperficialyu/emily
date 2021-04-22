import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Home from 'pages/Home/Home.jsx';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} /> {/*首页*/}
      </Switch>
    </Router>
  );
};

export default AppRouter;
