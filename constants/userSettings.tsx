import { useState } from "react";

export const [userInterfaceStyle, setUserInterfaceStyle] = useState<
  "light" | "dark" | "automatic"
>("light");
