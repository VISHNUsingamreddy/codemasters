import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import { encryptParam } from "../cryptoUtils";
import MainNavbar from "./MainNavbar";
import { AuthContext } from "../utility/AuthContext";
import { Container, Card, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "../LoadingScreen";
import { useTheme } from "../ThemeContext";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({});
  const [loadingc, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  useEffect(() => {
    if (user === undefined) {
      setUserLoading(true);
      return;
    }
    setUserLoading(false);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsSnapshot = await get(ref(database, "/codemasters"));
        const fetchedQuestions = questionsSnapshot.val() || {};

        const userId = user?.uid;
        let fetchedStatuses = {};

        if (user) {
          const statusesSnapshot = await get(ref(database, `/results/${userId}`));
          fetchedStatuses = statusesSnapshot.val() || {};
        }

        const mergedData = { ...fetchedQuestions };
        for (const category in fetchedQuestions) {
          if (fetchedQuestions[category]) {
            for (const questionId in fetchedQuestions[category]) {
              if (fetchedQuestions[category][questionId]) {
                mergedData[category][questionId].status =
                  fetchedStatuses[questionId] !== null &&
                  (fetchedStatuses[questionId] === true ||
                    fetchedStatuses[questionId] === false)
                    ? fetchedStatuses[questionId]
                    : "unknown";
              }
            }
          }
        }

        setCategories(Object.keys(mergedData));
        setData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (userLoading || loadingc) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <h4 className="text-danger fw-bold">{error}</h4>
      </Container>
    );
  }

  return (
    <motion.div
      className="min-vh-100"
      style={{ backgroundColor: "var(--background-color)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <MainNavbar />
      <Container className="py-5">
        <AnimatePresence>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Card
                  className="mb-4 bg-opacity-10 border-0 rounded-lg shadow-lg overflow-hidden"
                  style={{
                    background: "var(--card-bg)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Card.Header
                    className="fw-bold fs-5 text-uppercase"
                    style={{
                      background: "var(--header-gradient)",
                      padding: "1rem",
                      position: "relative",
                      overflow: "hidden",
                      color: "#fff",
                    }}
                  >
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      {index + 1}. {category}
                    </motion.div>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0.1), transparent)",
                        animation: "shine 3s infinite",
                      }}
                    />
                  </Card.Header>
                  <Card.Body className="p-4">
                    <ul className="list-group list-group-flush">
                      {Object.keys(data[category] || {}).map((key, questionIndex) => {
                        const encryptedCourse = encryptParam(category);
                        const encryptedQuestionId = encryptParam(key);
                        const problemData = data[category][key] || {};
                        const questionName = problemData.questionname || "Unnamed Question";
                        const status = problemData.status;
                        let statusColor = theme === "dark" ? "#888" : "#aaa";
                        if (status === true) statusColor = "#00ff00";
                        else if (status === false) statusColor = "#ff4444";

                        return (
                          <motion.li
                            key={key}
                            className="list-group-item d-flex justify-content-between align-items-center border-0 py-3 bg-opacity-10 rounded-lg shadow-sm"
                            style={{ background: "var(--card-bg)" }}
                            whileHover={{
                              scale: 1.02,
                              background:
                                theme === "dark"
                                  ? "rgba(255, 255, 255, 0.1)"
                                  : "rgba(0, 0, 0, 0.05)",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="d-flex align-items-center flex-grow-1">
                              <motion.span
                                className="me-3 fw-semibold fs-6"
                                style={{ color: "var(--button-border)" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 * questionIndex }}
                              >
                                {index + 1}.{questionIndex + 1} {questionName}
                              </motion.span>
                              {user && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {status === true ? (
                                    <FaCheck color={statusColor} />
                                  ) : status === false ? (
                                    <FaTimes color={statusColor} />
                                  ) : null}
                                </motion.div>
                              )}
                            </div>
                            <Button
                              as={Link}
                              to={`/prob/${encryptedCourse}/${encryptedQuestionId}`}
                              variant="outline-light"
                              className="btn-sm fw-bold text-uppercase"
                              style={{
                                border: `2px solid var(--button-border)`,
                                color: "var(--button-text)",
                                position: "relative",
                                overflow: "hidden",
                              }}
                              whileHover={{
                                scale: 1.1,
                                boxShadow: `0 0 15px var(--hover-glow)`,
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Problem
                              <motion.div
                                className="absolute inset-0"
                                style={{ background: "var(--hover-glow)" }}
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.4 }}
                              />
                            </Button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </Card.Body>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center fs-5"
              style={{ color: "var(--text-color)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No categories available.
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default Home;