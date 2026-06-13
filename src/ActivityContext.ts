import { createContext } from "react";

export interface ActivityContextValue {
  isActive: boolean;
}

export const ActivityContext = createContext<ActivityContextValue>({
  isActive: true, // default true — components outside any gate are always active
});
