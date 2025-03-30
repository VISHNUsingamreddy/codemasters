import { ThemeProvider } from "../ThemeContext";
import ProblemNavbar from "./ProblemNavbar";

function App() {
  return (
    <ThemeProvider>
      <ProblemNavbar
        toggleMode={() => {}}
        activeMode="statement"
        setlan={() => {}}
        lan="javascript"
        nextQuestionUrl="/next"
      />
    </ThemeProvider>
  );
}
export default App;