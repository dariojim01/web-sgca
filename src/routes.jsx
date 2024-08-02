import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,

} from "@heroicons/react/24/solid";
import { Home,   Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import TablesStudents from "./pages/dashboard/tablesStudent";
import ProtectedRoute from "./ProtectedRoute";
import LoadFile from "./pages/dashboard/loadFile";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "G. Convocatorias",
        path: "/carga",
        element: <LoadFile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "G. Certificados",
        path: "/tables",
        element: 
        <TablesStudents />
    
        ,
      },
     
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      
    
    ],
  },
 
];

export default routes;
