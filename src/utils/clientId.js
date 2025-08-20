import { v4 as uuidv4 } from "uuid";
import { saveToStorage, getFromStorage } from "./storage";

export const getOrCreateGuestId = () => {
  let guestId = getFromStorage("guestId");
  if (!guestId) {
    guestId = uuidv4(); 
    saveToStorage("guestId", guestId);
  }
  return guestId;
};
