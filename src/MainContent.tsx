import { Route, Routes } from "react-router-dom";
import { routes } from "./routers";

const MainContent = () => {
  return ( 
      <Routes>
        {routes.map((linke) => (
          <Route id={`${linke.id}`} element={linke.element} path={linke.href} />
        ))}
      </Routes>
 
  );
};

export default MainContent;
