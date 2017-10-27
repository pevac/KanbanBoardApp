import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Board from './components/Board';

export const routes = <Layout>
    <Route exact path='/board' component={ Board } />
</Layout>;
