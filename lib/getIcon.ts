import { IconType } from "react-icons";
import { HiPlus } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { GrStatusUnknown } from "react-icons/gr";

const icons = new Map<string, IconType>([
  ["plus", HiPlus],
  ["dashboard", MdDashboard],
  ["personList", BsFillPersonLinesFill],
]);

export const getIcon = (name: string) => {
  return icons.get(name) || GrStatusUnknown;
};
