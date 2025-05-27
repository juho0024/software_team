import React, { useEffect, useState, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import uniqid from "uniqid";
import {
    MultipleChoice,
    Paragraph,
    ShortResponse,
    SurveyTitle,
} from "./createQuestionComponents";
import { AlertDismissible } from './alert';
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../variables/constants.js";
import { useAuth } from "../../hooks/AuthContext";

export function CreateSurvey(props) {
    const { user, token } = useAuth(); // ✅ useAuth0 → useAuth 변경
    const [survey, setSurvey] = useState({
        title: "",
        description: "",
        questions: [],
        user_id: "",
    });
    const [questions, setQuestions] = useState([]);
    const [showAddQuestionBtn, setShowAddQuestionBtn] = useState(true);
    const [editingPreviousSurvey, setEditingPreviousSurvey] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const callApiToGetSurvey = useCallback(async () => {
        try {
            const response = await fetch(`${serverUrl}/api/surveys/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: "GET"
            });
            const data = await response.json();
            const qs = data.questions.map(q => ({
                _id: q._id,
                type: q.type,
                question: q.question,
                answer_choices: q.answer_choices,
            }));
            setSurvey({
                _id: data._id,
                title: data.title,
                description: data.description,
                user_id: data.user_id,
                questions: [],
            });
            setQuestions(qs);
        } catch (error) {
            console.log("설문 불러오기 실패:", error);
        }
    }, [token, id]);

    useEffect(() => {
        if (id) {
            callApiToGetSurvey();
            setEditingPreviousSurvey(true);
        } else if (user && user._id) {
            setSurvey(prev => ({
                ...prev,
                _id: uniqid("survey-"),
                user_id: user._id,
            }));
        }
    }, [user, id, callApiToGetSurvey]);

    const handleSurveyChange = (e) => {
        setSurvey({ ...survey, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (e) => {
        const index = questions.findIndex(q => q._id === e.target.id);
        const updated = [...questions];
        if (e.target.getAttribute("answer") === "yes") {
            updated[index].answer_choices[e.target.getAttribute("answernum")] = e.target.value;
        } else {
            updated[index].question = e.target.value;
        }
        setQuestions(updated);
    };

    const addMoreAnswerChoices = (e, id) => {
        const index = questions.findIndex(q => q._id === id);
        const updated = [...questions];
        updated[index].answer_choices.push("");
        setQuestions(updated);
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
            const response = await fetch(`${serverUrl}${url}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                ...fetchOptions,
            });
            return await response.json();
        } catch (error) {
            console.log("API 요청 오류:", error);
            return null;
        }
    }, [token]);

    const onSubmitSurvey = async (e) => {
        e.preventDefault();

        if (!survey.title || !survey.description || questions.length === 0 || !survey.user_id) {
            console.log("디버깅 로그 ⬇");
            console.log("title:", survey.title);
            console.log("description:", survey.description);
            console.log("questions.length:", questions.length);
            console.log("user_id:", survey.user_id);
            alert("모든 필드를 입력해 주세요.");
            return;
        }

        try {
            const result = await callApi("/api/surveys/create-update", {
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

            if (!result || !result._id) {
                throw new Error("서버 응답 없음 또는 설문 생성 실패");
            }

            props.sendSurveyId(survey._id);
            navigate(`/display-survey/${survey._id}`);
        } catch (err) {
            console.error("설문 등록 실패:", err);
            alert("❌ 설문 등록에 실패했습니다.");
        }
    };

    const renderQuestions = () =>
        questions.map((q, i) => {
            const props = {
                key: q._id,
                question: q,
                onChange: handleQuestionChange,
                deleteQuestion,
                index: i,
            };
            switch (q.type) {
                case "short response": return <ShortResponse {...props} />;
                case "multiple choice":
                case "true/false": return <MultipleChoice {...props} addAnswerChoice={addMoreAnswerChoices} />;
                case "paragraph": return <Paragraph {...props} />;
                default: return null;
            }
        });

    return (
        <main className="main" style={{ marginBottom: 20 }}>
            <div style={{ maxWidth: "50%", margin: "auto", paddingTop: 20 }}>
                <SurveyTitle onChange={handleSurveyChange} survey={survey} />
                {renderQuestions()}
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
        </main>
    );
}
