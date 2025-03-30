import React, { useCallback, useEffect, useContext, useState } from "react";
import { Navbar, Nav, ProgressBar, Button, Dropdown, Container, Badge } from "react-bootstrap";
import { CODE_SNIPPETS } from "../constants";
import { FaCode, FaMoon, FaSun, FaCheck, FaTimes } from "react-icons/fa";
import { useTheme } from "../ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { decryptParam } from "../cryptoUtils";
import { AuthContext } from "../utility/AuthContext";
import { useQuestions } from "../utility/QuestionProvider";
import LoadingScreen from "../LoadingScreen";
import { name } from "../constants";
import { motion } from "framer-motion";

const ProblemNavbar = ({ toggleMode, activeMode, setlan, lan, nextQuestionUrl }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { course, questionId } = useParams();
  const { totalQuestions } = useQuestions();
  const [progress, setProgress] = useState(0);
  const decryptedCourse = decryptParam(course);
  const decryptedQuestionId = decryptParam(questionId);
  const [statusIcon, setStatusIcon] = useState(null);
  const { user, loading } = useContext(AuthContext);

  const handlenext = () => {
    if (nextQuestionUrl) {
      navigate(`${nextQuestionUrl}`);
    } else {
      navigate("/home");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user || !user.uid) {
      console.warn("User is not authenticated");
      setStatusIcon(null);
      return;
    }

    const dataRef = ref(database, `results/${user.uid}/${decryptedQuestionId}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStatusIcon(
          data === true ? (
            <FaCheck style={{ color: "#00ff00" }} />
          ) : (
            <FaTimes style={{ color: "#ff4444" }} />
          )
        );
      } else {
        setStatusIcon(null);
      }
    });

    return () => unsubscribe();
  }, [decryptedQuestionId, user, loading]);

  useEffect(() => {
    if (totalQuestions !== undefined) {
      const updatedProgress = totalQuestions * 100;
      setProgress(updatedProgress);
    }
  }, [totalQuestions]);

  const displayLan = lan.charAt(0).toUpperCase() + lan.slice(1);

  const getProgressBarColor = (progress) => {
    if (progress < 30) return "danger";
    if (progress < 70) return "warning";
    return "success";
  };

  const handleLanguageChange = useCallback(
    async (language) => {
      setlan(language);
      localStorage.setItem("lan", language);
    },
    [setlan]
  );

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar
        expand="lg"
        sticky="top"
        className="navbar shadow-sm"
      >
        <Container fluid>
          {/* Brand Name */}
          <motion.div whileHover={{ scale: 1.1 }}>
            <Navbar.Brand
              style={{ color: "var(--text-color)", cursor: "pointer" }}
              onClick={() => navigate("/home")}
            >
              {name}
            </Navbar.Brand>
          </motion.div>

          {/* Nav Links */}
          <Nav className="me-auto">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Nav.Link
                onClick={() => toggleMode("statement")}
                active={activeMode === "statement"}
                style={{ color: activeMode === "statement" ? "var(--button-border)" : "var(--text-color)" }}
              >
                Statement
              </Nav.Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Nav.Link
                onClick={() => toggleMode("solution")}
                active={activeMode === "solution"}
                style={{ color: activeMode === "solution" ? "var(--button-border)" : "var(--text-color)" }}
              >
                Solution
              </Nav.Link>
            </motion.div>
          </Nav>

          {/* Right Section */}
          <div className="d-flex align-items-center">
            {/* Theme Toggle Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="me-3"
                style={{
                  border: `2px solid var(--button-border)`,
                  color: "var(--button-text)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "var(--hover-glow)" }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>

            {/* Language Dropdown */}
            <Dropdown className="ms-3">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Dropdown.Toggle
                  variant="outline"
                  id="dropdown-languages"
                  style={{
                    border: `2px solid var(--button-border)`,
                    color: "var(--button-text)",
                    background: "var(--card-bg)",
                  }}
                >
                  <FaCode className="me-2" />
                  {displayLan}
                </Dropdown.Toggle>
              </motion.div>
              <Dropdown.Menu>
                {Object.keys(CODE_SNIPPETS).map((language) => (
                  <Dropdown.Item
                    key={language}
                    onClick={() => handleLanguageChange(language)}
                    style={{ color: "black" }}
                  >
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Progress Bar */}
            <motion.div
              className="ms-3 d-flex align-items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span style={{ color: "var(--muted-text)" }} className="me-2">
                Progress
              </span>
              <ProgressBar
                now={progress}
                label={`${progress.toFixed(2)}%`}
                variant={getProgressBarColor(progress)}
                style={{
                  width: "150px",
                  height: "20px",
                  borderRadius: "10px",
                  background: "var(--progress-bg)",
                  boxShadow: `0 0 10px var(--hover-glow)`,
                }}
              />
            </motion.div>

            {/* Status Icon */}
            <motion.div
              className="ms-3 d-flex align-items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {statusIcon && (
                <Badge
                  pill
                  bg={statusIcon.props.style.color === "#00ff00" ? "success" : "danger"}
                  className="ms-2"
                >
                  {statusIcon}
                </Badge>
              )}
            </motion.div>

            {/* Next Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="ms-3"
                onClick={handlenext}
                style={{
                  border: `2px solid var(--button-border)`,
                  color: "var(--button-text)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                Next
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "var(--hover-glow)" }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>
          </div>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default ProblemNavbar;