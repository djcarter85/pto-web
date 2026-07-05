import type { ReactNode } from "react";
import { BarChartLine, Trophy } from "react-bootstrap-icons";
import { Link } from "react-router";

const NavLink = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: ReactNode;
}) => {
  return (
    <Link
      key={title}
      to={href}
      className="relative flex h-full basis-full cursor-pointer flex-col items-center justify-center gap-1 border-t-2 border-transparent text-gray-900"
    >
      <div className="text-xl">{icon}</div>
      <div className="text-sm">{title}</div>
    </Link>
  );
};

export const Nav = () => {
  return (
    <nav className="fixed right-0 bottom-0 left-0 w-full border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md flex-row items-center justify-around">
        <NavLink title="Leaderboard" href="/leaderboard" icon={<Trophy />} />
        <NavLink title="Results" href="/results" icon={<BarChartLine />} />
      </div>
    </nav>
  );
};
