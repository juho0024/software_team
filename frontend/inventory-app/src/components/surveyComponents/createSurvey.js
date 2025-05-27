import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/AuthContext';

export const CreateSurvey = () => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await axios.post(
          'http://localhost:5000/api/surveys',
          {
            title,
            description,
            creator: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      if (res.data && res.data.survey) {
        setMessage('설문이 성공적으로 생성되었습니다!');
        setTitle('');
        setDescription('');
      } else {
        setMessage('설문 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setMessage('서버 오류로 설문을 생성할 수 없습니다.');
    }
  };

  return (
      <div className="container mt-5">
        <h2 className="mb-4">새 설문 만들기</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">설문 제목</label>
            <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">설문 설명</label>
            <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            설문 생성
          </button>
        </form>
      </div>
  );
};
