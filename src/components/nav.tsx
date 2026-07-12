import type { ReactNode } from "react";
import { BarChartLine, Trophy } from "react-bootstrap-icons";
import { Link } from "react-router";

const CrystalBall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
  >
    <circle
      cx={8}
      cy={6.5}
      r={4.5}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 11h4 M5 13h6 M4 15h8 M5.3 4.7c.3-1 1.1-1.8 2.1-2.1"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

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
        <NavLink title="Predict" href="/predict" icon={<CrystalBall />} />
        <NavLink title="Results" href="/results" icon={<BarChartLine />} />
      </div>
    </nav>
  );
};
