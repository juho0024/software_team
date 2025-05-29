import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import uniqid from 'uniqid';
import {
    MultipleChoice,
    Paragraph,
    ShortResponse,
    TrueFalse,
    SurveyTitle
} from './createQuestionComponents';
import { useAuth } from '../../hooks/AuthContext'; // ✅ JWT 기반 인증 사용

export function EditSurvey(props) {
    const { token } = useAuth();
    const [survey, setSurvey] = useState({
        _id: '',
        title: '',
        description: '',
        user_id: props.id,
        questions: []
    });
    const [questions, setQuestions] = useState([]);
    const [showAddQuestionBtn, setShowAddQuestionBtn] = useState(true);

    const handleSurveyChange = (e) => {
        setSurvey({ ...survey, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (e) => {
        const questionArray = [...questions];
        const index = questionArray.findIndex(q => q._id === e.target.id);

        if (e.target.getAttribute('answer') === 'yes') {
            const answerChoices = [...questionArray[index].answer_choices];
            answerChoices[e.target.getAttribute('answernum')] = e.target.value;
            questionArray[index].answer_choices = answerChoices;
        } else {
            questionArray[index].question = e.target.value;
        }
        setQuestions(questionArray);
    };

    const addMoreAnswerChoices = (e, id) => {
        const questionArray = [...questions];
        const index = questionArray.findIndex(q => q._id === id);
        questionArray[index].answer_choices.push('');
        setQuestions(questionArray);
    };

    const addQuestion = (e) => {
        const questionArray = [...questions];
        const type = e.target.value;
        const newQuestion = {
            _id: uniqid('question-'),
            question: '',
            responses: []
        };

        switch (type) {
            case '1':
                newQuestion.type = 'short response';
                newQuestion.answer_choices = [];
                break;
            case '2':
                newQuestion.type = 'multiple choice';
                newQuestion.answer_choices = ['', ''];
                break;
            case '3':
                newQuestion.type = 'true/false';
                newQuestion.answer_choices = ['True', 'False'];
                break;
            case '4':
                newQuestion.type = 'paragraph';
                newQuestion.answer_choices = [];
                break;
            default:
                return;
        }

        questionArray.push(newQuestion);
        setQuestions(questionArray);
    };

    const deleteQuestion = (e, id) => {
        const questionArray = [...questions].filter(q => q._id !== id);
        setQuestions(questionArray);
    };

    const callApi = useCallback(async (url, fetchOptions) => {
        const serverUrl = 'http://localhost:5000';
        try {
            const response = await fetch(`${serverUrl}${url}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                ...fetchOptions
            });
            return await response.json();
        } catch (error) {
            console.error("❌ API 호출 실패:", error);
        }
    }, [token]);

    const onSubmitSurvey = async (e) => {
        e.preventDefault();

        await callApi('/api/surveys/create-update', {
            method: 'POST',
            body: JSON.stringify({
                ...survey,
                questions,
                creationTime: new Date()
            })
        });

        await callApi(`/users/updateSurveys/${survey.user_id}`, {
            method: 'PUT',
            body: JSON.stringify({ survey_id: survey._id })
        });

        props.switchView('displaySurvey');
        props.sendSurveyId(survey._id);
    };

    const renderForm = () => {
        const questionForms = questions.map((q, i) => {
            const commonProps = {
                key: q._id,
                question: q,
                onChange: handleQuestionChange,
                deleteQuestion,
                index: i
            };
            switch (q.type) {
                case 'short response': return <ShortResponse {...commonProps} />;
                case 'multiple choice': return <MultipleChoice {...commonProps} addAnswerChoice={addMoreAnswerChoices} />;
                case 'true/false': return <TrueFalse {...commonProps} addAnswerChoice={addMoreAnswerChoices} />;
                case 'paragraph': return <Paragraph {...commonProps} />;
                default: return null;
            }
        });

        return (
            <div style={{ maxWidth: '50%', margin: 'auto', paddingTop: 20 }}>
                <SurveyTitle onChange={handleSurveyChange} survey={survey} />
                {questionForms}
                {showAddQuestionBtn ? (
                    <div>
                        {questions.length > 0 && <Button style={{ margin: 10 }} variant="success" onClick={() => setShowAddQuestionBtn(false)}>질문 추가</Button>}
                        {questions.length > 0 && <Button variant="info" onClick={onSubmitSurvey}>저장하고 설문 완료</Button>}
                        {questions.length === 0 && <Button variant="info" onClick={() => setShowAddQuestionBtn(false)}>질문 추가</Button>}
                    </div>
                ) : (
                    <>
                        <h4>질문 유형 선택</h4>
                        <Form.Select aria-label="Select Question Type" onChange={addQuestion}>
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

    return <main className="main">{renderForm()}</main>;
}
