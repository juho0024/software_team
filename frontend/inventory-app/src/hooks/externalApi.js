import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

// ✅ 환경변수에서 API 주소 가져오기
const apiOrigin = process.env.REACT_APP_API_URL;

export const ExternalApiComponent = () => {
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState((prev) => ({ ...prev, error: null }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.error }));
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState((prev) => ({ ...prev, error: null }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.error }));
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setState((prev) => ({
        ...prev,
        showResult: true,
        apiMessage: responseData,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.error }));
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
      <>
        <div className="mb-5">
          {state.error === "consent_required" && (
              <Alert color="warning">
                You need to{" "}
                <a
                    href="#/"
                    className="alert-link"
                    onClick={(e) => handle(e, handleConsent)}
                >
                  consent to get access to users api
                </a>
              </Alert>
          )}

          <h1>External API</h1>
          <p className="lead">Ping an external API by clicking the button below.</p>
          <p>
            This will call a local API on port 5000. An access token is sent as part
            of the request's `Authorization` header and the API will validate it.
          </p>

          <Button color="primary" className="mt-5" onClick={callApi}>
            Ping API
          </Button>
        </div>

        <div className="result-block-container">
          {state.showResult && (
              <div className="result-block" data-testid="api-result">
                <h6 className="muted">Result</h6>
                <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
              </div>
          )}
        </div>
      </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <h3>Loading...</h3>,
});
