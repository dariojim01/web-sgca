import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "CONVOCATORIAS",
    value: "3",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Estudiantes",
    value: "1850",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  
 
];

export default statisticsCardsData;
