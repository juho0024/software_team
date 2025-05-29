import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../../variables/constants";
import {
  SurveyTitle,
  Paragraph,
  ShortResponse,
  MultipleChoice,
  TrueFalse,
} from "./displayQuestionComponents";
import uniqid from "uniqid";

export function DisplaySurvey() {
  const [survey, setSurvey] = useState({});
  const [renderedForm, setRenderedForm] = useState(
      <div className="text-center p-4"><Spinner animation="border" /></div>
  );

  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  const callApi = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${serverUrl}/api/surveys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        method: "GET"
      });
      const data = await res.json();

      // 각 질문에 response 객체 추가
      const questions = data.questions.map(q => ({
        ...q,
        response: {
          response: "",
          time: "",
          _id: uniqid("response-")
        }
      }));

      setSurvey({
        ...data,
        questions
      });
    } catch (error) {
      console.error("설문 불러오기 실패:", error);
    }
  }, [getAccessTokenSilently, id]);

  useEffect(() => {
    callApi();
  }, [callApi]);

  const handleChange = (e, responseId, responseType) => {
    const updated = { ...survey };
    const idx = updated.questions.findIndex(q => q.response._id === responseId);
    updated.questions[idx].response = {
      ...updated.questions[idx].response,
      response: e.target.value,
      time: new Date()
    };
    setSurvey(updated);
  };

  const submitSurvey = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await fetch(`${serverUrl}/api/surveys/update-responses/${survey._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: survey._id,
          questions: survey.questions
        })
      });
      navigate(`/display-survey/submit-survey/${id}`);
    } catch (err) {
      console.error("응답 제출 실패:", err);
    }
  };

  useEffect(() => {
    if (!survey.title) return;

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
        case "multiple choice": return <MultipleChoice {...props} />;
        case "true/false": return <MultipleChoice {...props} />;
        case "paragraph": return <Paragraph {...props} />;
        default: return null;
      }
    });

    setRenderedForm(form);
  }, [survey]);

  return (
      <div className="displaySurvey">
        <SurveyTitle survey={survey} />
        {renderedForm}
        <Button className="mt-4" onClick={submitSurvey}>제출하기</Button>
      </div>
  );
}
