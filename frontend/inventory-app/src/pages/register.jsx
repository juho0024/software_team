import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  let navigate = useNavigate();

  const onChange = (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const sendRequest = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/create", {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      });
      const response = await res.json();
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate('/dashboard'));
  };

  return (
      <section className="form">
        <h2 className="text-center py-3">회원가입</h2>
        <h5 className="text-center">계정을 생성해 주세요</h5>
        <Form style={{ width: '40%', margin: 'auto' }} onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>이름</Form.Label>
            <Form.Control
                name="name"
                value={user.name}
                onChange={onChange}
                type="text"
                placeholder="이름을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>이메일 주소</Form.Label>
            <Form.Control
                name="email"
                value={user.email}
                onChange={onChange}
                type="email"
                placeholder="example@domain.com"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
                name="password"
                value={user.password}
                onChange={onChange}
                type="password"
                placeholder="비밀번호를 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password2">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
                name="password2"
                value={user.password2}
                onChange={onChange}
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
            />
          </Form.Group>

          <Button variant="success" type="submit">가입하기</Button>
        </Form>
      </section>
  );
}

export default Register;
