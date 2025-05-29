import React, { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Spinner
} from "react-bootstrap";
import {
  ShortResponseResults,
  MultipleChoiceResults
} from "./displayResultsComponents";
import { serverUrl } from "../../variables/constants";

export function DisplayResults() {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [survey, setSurvey] = useState(null);
  const [results, setResults] = useState(
      <div style={{ textAlign: "center", padding: 20 }}>
        <Spinner animation="border" />
      </div>
  );

  const fetchSurveyResults = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${serverUrl}/api/surveys/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setSurvey(data);
    } catch (error) {
      console.error("설문 결과 가져오기 실패:", error);
    }
  }, [getAccessTokenSilently, id]);

  useEffect(() => {
    fetchSurveyResults();
  }, [fetchSurveyResults]);

  useEffect(() => {
    if (survey) {
      const renderedResults = survey.questions.map((q, idx) => {
        if (q.type === "multiple choice" || q.type === "true/false") {
          return (
              <MultipleChoiceResults
                  key={q._id}
                  question={q}
                  index={idx + 1}
              />
          );
        } else {
          return (
              <ShortResponseResults
                  key={q._id}
                  question={q}
                  index={idx + 1}
              />
          );
        }
      });

      setResults(renderedResults);
    }
  }, [survey]);

  return (
      <div className="resultsbg">
        <h2 className="resultsTitle">{survey?.title}</h2>
        <h4 className="resultsSurveyTitle">설문 결과</h4>
        <Container>{results}</Container>
      </div>
  );
}
