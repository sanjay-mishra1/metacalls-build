import "../../styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "redux";
import { userReducer } from "../../store/reducer";
import "../../components/UI/CallPageFooter/CallPageFooter.scss";
import { Provider as AuthProvider } from "next-auth/client";

export const store = createStore(userReducer);
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </AuthProvider>
  );
}

export default MyApp;
