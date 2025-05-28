import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../../variables/constants";
import {
  SurveyTitle,
  Paragraph,
  ShortResponse,
  MultipleChoice,
} from "./displayQuestionComponents";

import uniqid from "uniqid";
import { useAuth } from "../../hooks/AuthContext";

export function DisplaySurvey() {
  const [survey, setSurvey] = useState({});
  const [renderedForm, setRenderedForm] = useState(
      <div className="text-center p-4"><Spinner animation="border" /></div>
  );

  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const callApi = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/surveys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        method: "GET"
      });
      const data = await res.json();

      const questions = Array.isArray(data.questions)
          ? data.questions.map(q => ({
            ...q,
            response: {
              response: "",
              time: "",
              _id: uniqid("response-")
            }
          }))
          : [];

      setSurvey({
        ...data,
        questions
      });
    } catch (error) {
      console.error("설문 불러오기 실패:", error);
    }
  }, [token, id]);

  useEffect(() => {
    if (token) {
      callApi();
    }
  }, [callApi, token]);

  const handleChange = useCallback((e, responseId) => {
    setSurvey(prev => {
      const updated = { ...prev };
      const idx = updated.questions.findIndex(q => q.response._id === responseId);
      updated.questions[idx].response = {
        ...updated.questions[idx].response,
        response: e.target.value,
        time: new Date()
      };
      return updated;
    });
  }, []);

  const submitSurvey = async (e) => {
    e.preventDefault();
    try {
      const formattedResponses = survey.questions.map(q => ({
        _id: q._id,
        response: q.response
      }));

      await fetch(`${serverUrl}/api/surveys/${id}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          questions: formattedResponses
        })
      });

      navigate(`/display-survey/submit-survey/${id}`);
    } catch (err) {
      console.error("응답 제출 실패:", err);
    }
  };

  useEffect(() => {
    if (!Array.isArray(survey.questions)) return;

    const form = survey.questions.map((q, idx) => {
      const props = {
        key: q._id,
        question: q,
        index: idx,
        onChange: handleChange,
        responseId: q.response._id
      };
      switch (q.type) {
        case "short response": return <ShortResponse {...props} />;
        case "multiple choice":
        case "true/false": return <MultipleChoice {...props} />;
        case "paragraph": return <Paragraph {...props} />;
        default: return null;
      }
    });

    setRenderedForm(form);
  }, [survey, handleChange]);

  return (
      <div className="displaySurvey">
        <SurveyTitle survey={survey} />
        {renderedForm}
        <Button className="mt-4" onClick={submitSurvey}>제출하기</Button>
      </div>
  );
}
