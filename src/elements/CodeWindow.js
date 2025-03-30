import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import CodeEditor from "../code/CodeEditor";
import debounce from "lodash.debounce";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";

function CodeWindow({ mode, data, lan }) {
  const [leftColWidth, setLeftColWidth] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const { theme } = useTheme();

  const testdata = [
    { input: data.testcases[0].input, output: data.testcases[0].expectedOutput },
    { input: data.testcases[1].input, output: data.testcases[1].expectedOutput },
    { input: data.testcases[2].input, output: data.testcases[2].expectedOutput },
  ];

  const handleMouseDown = (e) => {
    setDragging(true);
    setMouseStartX(e.clientX);
    setInitialWidth(leftColWidth);
    e.preventDefault();
  };

  const handleMouseMove = debounce((e) => {
    if (dragging) {
      const deltaX = e.clientX - mouseStartX;
      const newWidth = initialWidth + (deltaX / window.innerWidth) * 100;
      if (newWidth >= 10 && newWidth <= 90) setLeftColWidth(newWidth);
    }
  }, 10);

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const getSanitizedHTML = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  // Dynamic table styles with futuristic flair
  const tableStyles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "var(--table-bg)",
      color: "var(--text-color)",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 0 10px var(--hover-glow)",
    },
    th: {
      padding: "10px",
      backgroundColor: "var(--table-header-bg)",
      color: "var(--text-color)",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      backgroundColor: "var(--table-bg)",
      color: "var(--text-color)",
      borderBottom: `1px solid var(--table-border)`,
    },
    tr: {
      borderBottom: `1px solid var(--table-border)`,
    },
    container: {
      padding: "20px",
      backgroundColor: "var(--card-bg)",
      borderRadius: "8px",
      margin: "20px 0",
      backdropFilter: "blur(10px)",
    },
    heading: {
      color: "var(--text-color)",
      marginBottom: "15px",
      fontSize: "1.25rem",
    },
  };

  return (
    <motion.div
      style={{
        backgroundColor: "var(--background-color)",
        display: "flex",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Column for Question */}
      <motion.div
        style={{
          width: `${leftColWidth}%`,
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          background: "var(--card-bg)",
          backdropFilter: "blur(10px)",
        }}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="d-flex flex-column"
          style={{ width: "100%", overflowY: "auto" }}
        >
          <div
            className="w-100"
            style={{
              padding: "1rem",
              color: "var(--text-color)",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div
                dangerouslySetInnerHTML={
                  mode === "statement"
                    ? getSanitizedHTML(data.question + "")
                    : getSanitizedHTML(data.solution)
                }
              />
            </motion.div>

            {mode === "statement" && (
              <motion.div
                style={tableStyles.container}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 style={tableStyles.heading}>Sample Test Cases :</h3>
                <table style={tableStyles.table}>
                  <thead>
                    <tr style={tableStyles.tr}>
                      <th style={tableStyles.th}>Input</th>
                      <th style={tableStyles.th}>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testdata.map((row, index) => (
                      <motion.tr
                        key={index}
                        style={tableStyles.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * index + 0.5 }}
                      >
                        <td style={tableStyles.td}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: row.input.replace(/\n/g, "<br>"),
                            }}
                          />
                        </td>
                        <td style={tableStyles.td}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: row.output.replace(/\n/g, "<br>"),
                            }}
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Resizable Divider */}
      <motion.div
        style={{
          width: "5px",
          cursor: "ew-resize",
          backgroundColor: "var(--divider-color)",
          height: "100%",
          zIndex: 1,
          position: "relative",
        }}
        onMouseDown={handleMouseDown}
        whileHover={{ backgroundColor: "var(--button-border)" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: "var(--hover-glow)" }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Right Column for CodeEditor */}
      <motion.div
        style={{
          width: `${100 - leftColWidth}%`,
          height: "100%",
          overflowY: "auto",
          background: "var(--card-bg)",
          backdropFilter: "blur(10px)",
        }}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CodeEditor lan={lan} data={data} />
      </motion.div>
    </motion.div>
  );
}

export default CodeWindow;