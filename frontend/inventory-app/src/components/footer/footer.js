import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export function Footer() {
  return (
    <footer
      className="footer"
      style={{
        height: "10%",
        backgroundColor: "#008cba",
        color: "white",
      }}
    >
      <Container fluid>
        <Row>
          <Col className="text-center py-2">
            &copy; 2025 설문 플랫폼 by Ckaminski Labs
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
