import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Button
} from "react-bootstrap";  // ✅ 버튼 추가
import {
  ShortResponseResults,
  MultipleChoiceResults
} from "./displayResultsComponents";
import { serverUrl } from "../../variables/constants";
import { useAuth } from "../../hooks/AuthContext";

export function DisplayResults() {
  const { id } = useParams();
  const { token } = useAuth();
  const [survey, setSurvey] = useState(null);
  const [results, setResults] = useState(
      <div style={{ textAlign: "center", padding: 20 }}>
        <Spinner animation="border" />
      </div>
  );

  // ✅ 당첨자 상태 추가
  const [winner, setWinner] = useState(null);

  const fetchSurveyResults = useCallback(async () => {
    try {
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
  }, [token, id]);

  useEffect(() => {
    if (token) {
      fetchSurveyResults();
    }
  }, [fetchSurveyResults, token]);

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

  // ✅ 당첨자 뽑기 함수
  const pickWinner = () => {
    if (!survey || !survey.questions?.length) return;

    const responses = survey.questions[0].responses.filter(r => r.name); // 이름 있는 응답만
    if (responses.length === 0) return;

    const random = responses[Math.floor(Math.random() * responses.length)];
    setWinner(`카카오ID : '${random.name}'`);
  };

  return (
      <div className="resultsbg">
        <h2 className="resultsTitle">{survey?.title}</h2>
        <h4 className="resultsSurveyTitle">설문 결과</h4>

        <Container>{results}</Container>

        {/* ✅ 당첨자 뽑기 UI */}
        <div className="text-center my-4">
          <Button variant="success" onClick={pickWinner}>🎉 당첨자 뽑기</Button>
          {winner && (
              <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
                <strong>{winner}</strong>
              </div>
          )}
        </div>
      </div>
  );
}
