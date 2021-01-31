import React from 'react'
import { UserContextInterface } from "./appBase/interfaces"


const UserContext = React.createContext<UserContextInterface | undefined>(undefined);
interface Props { children: React.ReactNode; }

export const UserProvider = ({ children }: Props) => {
  const [userName, setUserName] = React.useState("");
  const [churchName, setChurchName] = React.useState("");
  return <UserContext.Provider value={{ userName, setUserName, churchName, setChurchName }}>{children} </UserContext.Provider>
};

export default UserContext;

