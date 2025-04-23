type Question = {
  id: number;
  category: string;
  question: string;
};

export const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdIRDSdSJ7hPsc84aAO9yJAZUAF6TTDAY35AC6QYmFsbfRuGw/formResponse";

export const ENTRY_IDS = {
  sessionId: "entry.60489562",
  acceptedCards: "entry.1651876338",
  rejectedCards: "entry.738247076",
  categories: "entry.1516522829",
  deviceInfo: "entry.1791082658",
};

export const FINAL_CARD: Question = {
  id: -1,
  category: "",
  question: "Cards finished. \n Redirecting you back.",
};
