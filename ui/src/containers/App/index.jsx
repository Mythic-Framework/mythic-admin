import "@babel/polyfill";

import React from "react";
import { useSelector } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { HashRouter } from "react-router-dom";

import "react-image-lightbox/style.css";

import Panel from "../Panel";

library.add(fab, fas);

export default () => {
  const theme = "dark";
  const job = useSelector((state) => state.app.govJob);

  const muiTheme = createTheme({
    typography: {
      fontFamily: ["Oswald"],
      fontWeightRegular: 400,
    },
    palette: {
      primary: {
        main: "#208692",
        light: "#4db8c4",
        dark: "#0e5a62",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#121025",
        light: "#1c1a30",
        dark: "#0a0914",
        contrastText: "#ffffff",
      },
      error: {
        main: "#6e1616",
        light: "#a13434",
        dark: "#430b0b",
      },
      success: {
        main: "#52984a",
        light: "#60eb50",
        dark: "#244a20",
      },
      warning: {
        main: "#f09348",
        light: "#f2b583",
        dark: "#b05d1a",
      },
      info: {
        main: "#247ba5",
        light: "#247ba5",
        dark: "#175878",
      },
      text: {
        main: "#ffffff",
        alt: "rgba(255, 255, 255, 0.6)",
        info: "#919191",
        light: "#ffffff",
        dark: "#000000",
      },
      alt: {
        green: "#008442",
        greenDark: "#064224",
      },
      border: {
        main: "rgba(32,134,146,0.08)",
        light: "#ffffff",
        dark: "#26292d",
        input: "rgba(255, 255, 255, 0.23)",
        divider: "rgba(32,134,146,0.15)",
      },
      mode: "dark",
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 14,
            fontFamily: "'Rajdhani', sans-serif",
            backgroundColor: "#121025",
            border: "1px solid rgba(32,134,146,0.3)",
            boxShadow: "0 0 20px rgba(0,0,0,0.6)",
            borderRadius: 2,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: "#0e0c1e",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: "#121025 !important",
            border: "1px solid rgba(32,134,146,0.25)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(32,134,146,0.06)",
            borderRadius: "2px !important",
            marginTop: 4,
          },
          list: {
            padding: "4px 0",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.7)",
            padding: "8px 16px",
            transition: "all 0.15s ease",
            "&:hover": {
              background: "rgba(32,134,146,0.1)",
              color: "#ffffff",
            },
            "&.Mui-selected": {
              background: "rgba(32,134,146,0.15)",
              color: "#208692",
              "&:hover": {
                background: "rgba(32,134,146,0.22)",
              },
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
            background: "#121025",
            border: "1px solid rgba(32,134,146,0.25)",
            borderRadius: 2,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: "rgba(32,134,146,0.5)",
            transition: "color 0.2s ease",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            height: "90%",
            width: "60%",
            margin: "auto",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          ".Toastify__toast-container--bottom-right": {
            bottom: "0.5em !important",
            right: "0.5em !important",
            position: "absolute !important",
          },
          ".Toastify__toast": {
            fontFamily: "'Rajdhani', sans-serif",
            background: "rgba(18,16,37,0.96)",
            border: "1px solid rgba(32,134,146,0.2)",
            borderRadius: "2px",
          },
          ".tox-dialog-wrap__backdrop": {
            height: "90% !important",
            width: "90% !important",
            margin: "auto !important",
            background: "#121025bf !important",
          },
          ".tox-statusbar__branding": {
            display: "none !important",
          },
          "*": {
            "&::-webkit-scrollbar": {
              width: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(32,134,146,0.3)",
              borderRadius: 2,
              transition: "background ease-in 0.15s",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#208692",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
          },
          html: {
            background:
              process.env.NODE_ENV != "production" ? "#121025" : "transparent",
            "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
          },
          body: {
            position: "relative",
            zIndex: -15,
            backgroundColor: "#121025",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            height: "90%",
            width: "60%",
            borderRadius: 2,
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "0px !important",
            border: "none",
            boxShadow: "none",
            background: "transparent",

            ".item-enter": {
              opacity: 0,
            },
            ".item-enter-active": {
              opacity: 1,
              transition: "opacity 500ms ease-in",
            },
            ".item-exit": {
              opacity: 1,
            },
            ".item-exit-active": {
              opacity: 0,
              transition: "opacity 500ms ease-in",
            },
            ".fade-enter": {
              opacity: 0,
            },
            ".fade-exit": {
              opacity: 1,
            },
            ".fade-enter-active": {
              opacity: 1,
            },
            ".fade-exit-active": {
              opacity: 0,
            },
            ".fade-enter-active, .fade-exit-active": {
              transition: "opacity 500ms",
            },
          },
          a: {
            textDecoration: "none",
            color: "#fff",
          },
          "#root": {
            position: "relative",
            zIndex: -10,
          },
          "@keyframes bouncing": {
            "0%": {
              bottom: 0,
              opacity: 0.25,
            },
            "100%": {
              bottom: 50,
              opacity: 1.0,
            },
          },
          "@keyframes ripple": {
            "0%": {
              transform: "scale(.8)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(2.4)",
              opacity: 0,
            },
          },
        },
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <HashRouter>
          <Panel />
        </HashRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
