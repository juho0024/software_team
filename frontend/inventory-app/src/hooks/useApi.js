// use-api.js
import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


export const useCallApi = async (url, fetchOptions) => {
  const { getAccessTokenSilently } = useAuth0();
  const serverUrl = 'http://localhost:5000';
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${serverUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }, ...fetchOptions
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error.error);
  }
};

/*
export const useApi = (url, options = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};*/