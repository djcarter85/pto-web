import type { ReactNode } from "react";

export const Main = ({ children }: { children: ReactNode }) => {
  return <main className="pb-16">{children}</main>;
};
