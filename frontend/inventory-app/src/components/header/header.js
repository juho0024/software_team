import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useAuth0 } from "@auth0/auth0-react";
import { logoutUrl } from "../../variables/constants";
import logo from "../../images/gclogo.png";

export function Header() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userData && user) {
      setUserData({ name: user.name, _id: user.sub });
    }

    // ✅ 로그인 사용자 정보 콘솔 출력
    console.log("🔍 현재 로그인 상태:");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);
  }, [user, isAuthenticated]);

  return (
      <header>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href={isAuthenticated ? "/dashboard" : "/"}>
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
                    <Nav.Link href="/dashboard">대시보드</Nav.Link>
                    <Nav.Link href="/create-survey">설문 만들기</Nav.Link>
                  </Nav>
              )}
              <Nav className="ms-auto">
                {user ? (
                    <>
                      <Navbar.Text className="me-3">
                        {user.name} 님 환영합니다
                      </Navbar.Text>
                      <button
                          className="headerLink"
                          onClick={() => logout({ returnTo: logoutUrl })}
                      >
                        로그아웃
                      </button>
                    </>
                ) : (
                    <button className="headerLink" onClick={loginWithRedirect}>
                      <Person /> 로그인 또는 회원가입
                    </button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
  );
}

export default Header;
