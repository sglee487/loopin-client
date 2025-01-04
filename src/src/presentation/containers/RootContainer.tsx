import {Outlet} from "react-router-dom";

const RootContainer: React.FC = () => {
    return (
        <>
            <h1>
                SN
            </h1>
            <Outlet />
            <footer>
                sn
            </footer>
        </>
    )
}

export default RootContainer;
