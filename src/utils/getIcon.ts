import { IconType } from "react-icons";
import { HiPlus } from "react-icons/hi";
import { MdAdd, MdDashboard } from "react-icons/md";
import {
  BsFillCalendarFill,
  BsFillPersonLinesFill,
  BsFillTrashFill,
  BsJournalCheck,
  BsXLg,
} from "react-icons/bs";
import { GrStatusUnknown } from "react-icons/gr";
import { GoChevronDown } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";

const icons = new Map<string, IconType>([
  ["plus", HiPlus],
  ["dashboard", MdDashboard],
  ["personList", BsFillPersonLinesFill],
  ["downArrow", GoChevronDown],
  ["group", FaUsers],
  ["signOut", BiLogIn],
  ["add", MdAdd],
  ["close", BsXLg],
  ["calendar", BsFillCalendarFill],
  ["trash", BsFillTrashFill],
  ["taskList", BsJournalCheck],
]);

export const getIcon = (name: string) => {
  return icons.get(name) || GrStatusUnknown;
};
