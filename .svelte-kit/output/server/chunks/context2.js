import { d as createContext } from "./context.js";
import "clsx";
const [getGameSession, setGameSession] = createContext();
export {
  getGameSession as g,
  setGameSession as s
};
