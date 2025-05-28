import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../../hooks/AuthContext';
import uniqid from 'uniqid';
import axios from 'axios';

export const CreateSurvey = () => {
  const { user, token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        _id: uniqid('question-'),
        question: '',
        type: 'short response',
        answer_choices: [],
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    // 객관식일 경우 기본적으로 2개 항목
    if (field === 'type' && value === 'multiple choice') {
      updated[index].answer_choices = ['', ''];
    } else if (field === 'type' && value === 'true/false') {
      updated[index].answer_choices = ['True', 'False'];
    } else if (field === 'type') {
      updated[index].answer_choices = [];
    }

    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer_choices[aIndex] = value;
    setQuestions(updated);
  };

  const addAnswerChoice = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].answer_choices.push('');
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user || !user._id) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await axios.post(
          'http://localhost:5000/api/surveys/create-update',
          {
            title,
            description,
            questions,
            user_id: user._id,
            survey_id: uniqid('survey-'),
            creationTime: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (res.data?.success) {
        setMessage('✅ 설문 생성 완료');
        setTitle('');
        setDescription('');
        setQuestions([]);
      } else {
        setMessage('❌ 설문 생성 실패');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ 서버 오류로 설문을 생성할 수 없습니다.');
    }
  };

  return (
      <div className="container mt-4" style={{ maxWidth: '700px' }}>
        <h2>설문 만들기</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>설문 제목</Form.Label>
            <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>설문 설명</Form.Label>
            <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <h5>질문 목록</h5>
          {questions.map((q, index) => (
              <div key={q._id} className="mb-4 border p-3 rounded">
                <Form.Group className="mb-2">
                  <Form.Label>질문 {index + 1}</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="질문 입력"
                      value={q.question}
                      onChange={(e) =>
                          handleQuestionChange(index, 'question', e.target.value)
                      }
                      required
                  />
                </Form.Group>

                <Form.Select
                    value={q.type}
                    onChange={(e) =>
                        handleQuestionChange(index, 'type', e.target.value)
                    }
                    className="mb-2"
                >
                  <option value="short response">단답형</option>
                  <option value="paragraph">장문형</option>
                  <option value="multiple choice">객관식</option>
                  <option value="true/false">O/X</option>
                </Form.Select>

                {q.type === 'multiple choice' &&
                    q.answer_choices.map((ans, aIndex) => (
                        <Form.Control
                            key={aIndex}
                            className="mb-1"
                            type="text"
                            placeholder={`선택지 ${aIndex + 1}`}
                            value={ans}
                            onChange={(e) =>
                                handleAnswerChange(index, aIndex, e.target.value)
                            }
                        />
                    ))}

                {q.type === 'multiple choice' && (
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => addAnswerChoice(index)}
                    >
                      선택지 추가
                    </Button>
                )}
              </div>
          ))}

          <Button
              type="button"
              variant="secondary"
              className="me-2"
              onClick={handleAddQuestion}
          >
            질문 추가
          </Button>

          <Button type="submit" variant="primary">
            설문 생성
          </Button>
        </Form>
      </div>
  );
};
