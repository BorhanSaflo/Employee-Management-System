import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsFillMoonFill as MoonIcon } from "react-icons/bs";
import { BsFillSunFill as SunIcon } from "react-icons/bs";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (currentTheme === "dark")
    return (
      <button className="button" onClick={() => setTheme("light")}>
        <MoonIcon />
      </button>
    );
  else
    return (
      <button className="button" onClick={() => setTheme("dark")}>
        <SunIcon />
      </button>
    );
};

export default ThemeChanger;
