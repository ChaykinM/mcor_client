import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export default createVuetify(
  {
    theme: {
      defaultTheme: "westeros",
      themes: {
        dark_vintage: {
          colors: {
            background: "#333333",
            surface: "#3D3D3D",
            primary: "#262626",
            accent: "#24a39b", 
            secondary: "#7289ab",
            success: "#73a373", 
            info: "#73b9bc", 
            warning: "#eedd78",
            error: "#dd6b66", 
          },
        },
        westeros: {
          colors: {
            background: "#cccccc",
            surface: "#eeeeee",
            primary: "#006064",
            accent: "#24a39b",
            secondary: "#59c4e6",
            success: "#61a0a8",
            info: "#a5e7f0",
            warning: "#d87c7c",
            error: "#724e58",
          },
        },
      },
    },
  }
);
