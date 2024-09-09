import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        secondary: "#2196F3",
        accent: {
          lightGreen: "#81C784",
          lightBlue: "#64B5F6",
        },
        neutral: {
          white: "#FFFFFF",
          gray: "#9E9E9E",
          darkGray: "#616161",
          red: "#BB342F",
        },
      },
    },
  },
};
