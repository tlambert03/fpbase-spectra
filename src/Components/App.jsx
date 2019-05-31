import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import SpectraSelectForm from "./SpectraSelectForm";
import SpectraViewer from "./SpectraViewer";
import { Store, AppContext } from "./Store";
import LoadingLogo from "./LoadingLogo";
import SearchModal from "./SearchModal";
import WelcomeModal from "./WelcomeModal";
import theme from "./theme";
import SearchIcon from "@material-ui/icons/Search";


const App = () => {
  const { state } = useContext(AppContext);
  const [searchOpen, setSearchOpen] = React.useState(false);

  useEffect(() => {
    // window.onpopstate = event => {
    //   dispatch({
    //     type: "UPDATE",
    //     currentSpectra: event.state.currentSpectra
    //   });
    // };
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!state.loading) {
      const { currentSpectra, tab } = state;
      let url = window.location.pathname;
      if (currentSpectra.length > 0) {
        url = `?s=${currentSpectra.join(",")}&t=${tab}`;
      }
      window.history.pushState(state, "", url);
    }
  }, [state.currentSpectra, state.tab]) // eslint-disable-line

  return state && !state.loading ? (
    <div style={{ position: "relative" }}>
      <IconButton
        style={{
          position: "absolute",
          top: -2,
          right: 25,
          zIndex: 2,
          backgroundColor: "transparent"
        }}
        onClick={() => setSearchOpen(true)}
      >
        <SearchIcon />
      </IconButton>
      <SpectraViewer />
      <SpectraSelectForm />
      <SearchModal
        options={Object.values(state.owners)}
        open={searchOpen}
        setOpen={setSearchOpen}
      />
      <WelcomeModal />
    </div>
  ) : (
    <div style={{ position: "relative" }}>
      <WelcomeModal />
      <LoadingLogo />
    </div>
  );
};

const initReactSpectra = elem => {
  ReactDOM.render(
    <Store>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Store>,
    document.getElementById(elem)
  );
};

export default initReactSpectra;
