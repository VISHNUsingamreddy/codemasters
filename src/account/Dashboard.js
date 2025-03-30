import React, { useContext, useState, useEffect } from "react";
import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import { AuthContext } from "../utility/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingScreen from "../LoadingScreen";
import { useQuestions } from "../utility/QuestionProvider";
import { name } from "../constants";
import { useTheme } from "../ThemeContext";

const AppNavbar = () => {
  const { user, signInWithGoogle, logOut, isLoading } = useContext(AuthContext);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { totalQuestions } = useQuestions();
  const { theme } = useTheme();

  useEffect(() => {
    if (totalQuestions !== undefined) {
      const updatedProgress = totalQuestions * 100; // Convert to percentage
      setProgress(updatedProgress);
    }
  }, [totalQuestions]);

  useEffect(() => {
    if (user) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const handleImageError = () => {
    setPhotoURL(null); // Fallback to default icon
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ backgroundColor: "var(--background-color)", minHeight: "100vh" }}
    >
      {/* Navbar */}
      <Navbar expand="lg" className="navbar shadow-sm">
        <Container>
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Navbar.Brand style={{ color: "var(--text-color)" }}>
              {name}
            </Navbar.Brand>
          </motion.div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Nav.Link
                  onClick={() => navigate("/home")}
                  style={{ color: "var(--button-border)" }}
                >
                  Home
                </Nav.Link>
              </motion.div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-5 text-center">
        {isLoading ? (
          <LoadingScreen />
        ) : user ? (
          <motion.div
            className="user-info"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="profile-section mb-4">
              {photoURL ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={photoURL}
                    alt="Profile"
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3 border"
                    style={{ borderColor: "var(--button-border)" }}
                    onError={handleImageError}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaUser
                    size={120}
                    className="mb-3"
                    style={{ color: "var(--muted-text)" }}
                  />
                </motion.div>
              )}
              <motion.h3
                className="mt-2"
                style={{ color: "var(--text-color)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {user.displayName || "User"}
              </motion.h3>
              <motion.p
                style={{ color: "var(--muted-text)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Problems Solved: <strong>{progress}%</strong>
              </motion.p>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={logOut}
                style={{
                  border: `2px solid var(--button-border)`,
                  color: "var(--button-text)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                Log Out
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "var(--hover-glow)" }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              style={{ color: "var(--text-color)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Please Sign In to Continue
            </motion.h2>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={signInWithGoogle}
                style={{
                  border: `2px solid var(--button-border)`,
                  color: "var(--button-text)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <FaSignInAlt className="me-2" /> Sign In with Google
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "var(--hover-glow)" }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
};

export default AppNavbar;