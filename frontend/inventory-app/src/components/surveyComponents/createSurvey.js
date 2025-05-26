import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import uniqid from "uniqid";
import {
  MultipleChoice,
  Paragraph,
  ShortResponse,
  TrueFalse,
  SurveyTitle,
} from "./createQuestionComponents";
import { AlertDismissible } from './alert';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../variables/constants.js";

export function CreateSurvey(props) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    questions: [],
    user_id: "",
  });
  const [questionType, setQuestionType] = useState(1);
  const [showAddQuestionBtn, setShowAddQuestionBtn] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [editingPreviousSurvey, setEditingPreviousSurvey] = useState(false);
  let navigate = useNavigate();
  let { id } = useParams();

  const callApiToGetSurvey = useCallback(async (url, fetchOptions) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${serverUrl}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        ...fetchOptions
      });
      const responseData = await response.json();
      let questions = [];
      responseData.questions.forEach((question) => {
        questions.push({
          _id: question._id,
          type: question.type,
          question: question.question,
          answer_choices: question.answer_choices,
        });
      });
      setSurvey({
        _id: responseData._id,
        questions: [],
        title: responseData.title,
        description: responseData.description,
        user_id: responseData.user_id,
      });
      setQuestions(questions);
    } catch (error) {
      console.log(error.error);
    }
  }, [getAccessTokenSilently]);

  const startSurvey = () => {
    if(id){
      callApiToGetSurvey(`/api/surveys/${id}`, {method: "GET"});
      setEditingPreviousSurvey(true);
    } else {
      setSurvey({ ...survey, _id: uniqid("survey-"), user_id: user.sub });
    }
  };

  useEffect(() => {
    if(user && isAuthenticated){
      setSurvey({ ...survey, user_id: user.sub });
    }
  }, [user]);

  const handleSurveyChange = (e) => {
    setSurvey({ ...survey, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    const index = questions.findIndex(q => q._id === e.target.id);
    const updatedQuestions = [...questions];
    if (e.target.getAttribute("answer") === "yes") {
      updatedQuestions[index].answer_choices[e.target.getAttribute("answernum")] = e.target.value;
    } else {
      updatedQuestions[index].question = e.target.value;
    }
    setQuestions(updatedQuestions);
  };

  const addMoreAnswerChoices = (e, id) => {
    const index = questions.findIndex(q => q._id === id);
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer_choices.push("");
    setQuestions(updatedQuestions);
  };

  const addQuestion = (e) => {
    setShowAddQuestionBtn(true);
    const qType = e.target.value;
    const newQ = {
      type: "",
      question: "",
      answer_choices: [],
      _id: uniqid("question-"),
      responses: [],
    };
    switch (qType) {
      case "1": newQ.type = "short response"; break;
      case "2": newQ.type = "multiple choice"; newQ.answer_choices = ["", ""]; break;
      case "3": newQ.type = "true/false"; newQ.answer_choices = ["True", "False"]; break;
      case "4": newQ.type = "paragraph"; break;
      default: return;
    }
    setQuestions([...questions, newQ]);
  };

  const deleteQuestion = (e, id) => {
    setQuestions(questions.filter(q => q._id !== id));
  };

  const callApi = useCallback(async (url, fetchOptions) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${serverUrl}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        ...fetchOptions,
      });
      return await response.json();
    } catch (error) {
      console.log(error.error);
    }
  }, [getAccessTokenSilently]);

  const onSubmitSurvey = (e) => {
    e.preventDefault();
    callApi("/api/surveys/create-update", {
      method: "POST",
      body: JSON.stringify({
        questions,
        title: survey.title,
        description: survey.description,
        user_id: survey.user_id,
        creationTime: new Date(),
        survey_id: survey._id,
      }),
    });
    props.sendSurveyId(survey._id);
    window.open(`/display-survey/${survey._id}`, '_blank');
  };

  const makeSurvey = () => {
    const questionForms = questions.map((q, i) => {
      const props = {
        key: q._id,
        question: q,
        onChange: handleQuestionChange,
        deleteQuestion,
        index: i,
      };
      switch (q.type) {
        case "short response": return <ShortResponse {...props} />;
        case "multiple choice": return <MultipleChoice {...props} addAnswerChoice={addMoreAnswerChoices} />;
        case "true/false": return <TrueFalse {...props} addAnswerChoice={addMoreAnswerChoices} />;
        case "paragraph": return <Paragraph {...props} />;
        default: return null;
      }
    });

    return (
        <div style={{ maxWidth: "50%", margin: "auto", paddingTop: 20 }}>
          <SurveyTitle onChange={handleSurveyChange} survey={survey} />
          {questionForms}
          {showAddQuestionBtn ? (
              questions.length >= 1 ? (
                  <div>
                    {editingPreviousSurvey && <AlertDismissible />}
                    <Button style={{ margin: 10 }} variant="success" onClick={() => setShowAddQuestionBtn(false)}>질문 추가</Button>
                    <Button variant="info" onClick={onSubmitSurvey}>저장하고 설문 완료</Button>
                  </div>
              ) : (
                  <Button variant="info" onClick={() => setShowAddQuestionBtn(false)}>질문 추가</Button>
              )
          ) : (
              <>
                <h4>질문 유형 선택</h4>
                <Form.Select size="small" aria-label="Select Question Type" onChange={addQuestion}>
                  <option></option>
                  <option value="1">단답형</option>
                  <option value="2">객관식</option>
                  <option value="3">O/X</option>
                  <option value="4">장문형</option>
                </Form.Select>
              </>
          )}
        </div>
    );
  };

  useEffect(() => {
    startSurvey();
  }, []);

  return <main className="main" style={{ marginBottom: 20 }}>{makeSurvey()}</main>;
}
