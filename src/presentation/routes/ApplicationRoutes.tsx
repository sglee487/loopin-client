import React from 'react';
import {Route, Routes} from 'react-router-dom';
import PlaylistsContainer from '@presentation/containers/PlaylistsContainer.tsx';
import PlaylistContainer from '@presentation/containers/PlaylistContainer';
import RootContainer from "@presentation/containers/RootContainer.tsx";

const ApplicationRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootContainer/>}>
                <Route path="/" element={<PlaylistsContainer/>}/>
                <Route path="/playlist/:id" element={<PlaylistContainer/>}/>
            </Route>
        </Routes>
    );
};

export default ApplicationRoutes;
