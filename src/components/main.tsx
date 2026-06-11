import type { ReactNode } from "react";

export const Main = ({ children }: { children: ReactNode }) => {
  return <main className="mx-auto max-w-md">{children}</main>;
};
