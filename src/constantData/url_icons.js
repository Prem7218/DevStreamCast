import { Globe, Home, Info, Mail, PlusCircle } from "lucide-react";
export const cors = "https://cors-anywhere.herokuapp.com/";
export const devAPIStart=`https://dev.to/search/feed_content?`
export const devAPIEnd = `&sort_by=hotness_score&sort_direction=desc&approved=&class_name=Article`;
export const PHOTO_URL = "https://avatars.githubusercontent.com/u/161498035?v=4";
export const meetingIdFind = "https://api.8x8.vc/external/v1/meetings"; 

export const menuItems1 = [
  { name: "Internet", icon: <Globe /> },
  { name: "Meeto", icon: <PlusCircle /> },
];

export const Home = [{ name: "Home", icon: <Home /> }];

export const menuItem = [
  { name: "About", icon: <Info /> },
  { name: "Contact", icon: <Mail /> },
];

export const btn = (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
