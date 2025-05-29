import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../../hooks/AuthContext";
import logo from "../../images/gclogo.png";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
      <header>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href={user ? "/dashboard" : "/"}>
              <img
                  alt="logo"
                  src={logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
              />{" "}
              SurveyMaker
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="nav" />
            <Navbar.Collapse id="nav">
              {user && (
                  <Nav className="me-auto">
                    <Nav.Link href="/dashboard">대시보드 화면</Nav.Link>
                    <Nav.Link href="/create-survey">설문 작성하기</Nav.Link>
                  </Nav>
              )}
              <Nav className="ms-auto">
                {user ? (
                    <>
                      <Navbar.Text className="me-3">
                        {user.email} 님 환영합니다!
                      </Navbar.Text>
                      <button
                          className="btn btn-outline-light"
                          onClick={logout}
                      >
                        로그아웃
                      </button>
                    </>
                ) : (
                    <>
                      <button
                          className="btn btn-outline-light me-2"
                          onClick={() => navigate("/login")}
                      >
                        로그인
                      </button>
                      <button
                          className="btn btn-light text-primary fw-bold"
                          onClick={() => navigate("/register")}
                      >
                        회원가입
                      </button>
                    </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
  );
}

export default Header;
