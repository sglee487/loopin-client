import React from 'react';
import {Route} from 'react-router-dom';
import PlaylistsContainer from '../containers/PlaylistsContainer.tsx';
import PlaylistContainer from '../containers/PlaylistContainer';
import RootContainer from "../containers/RootContainer.tsx";

const ApplicationRoutes: React.FC = () => {
    return (
        <Route>
            <Route path="/" element={<RootContainer/>}>
                <Route path="/" element={<PlaylistsContainer/>}/>
                <Route path="/playlist/:id" element={<PlaylistContainer/>}/>
            </Route>
        </Route>
    )
        ;
};

export default ApplicationRoutes;
