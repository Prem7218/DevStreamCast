import { useEffect, useState } from "react";
import { model } from "../constantData/mock_data";

const useFetchQnsAns = () => {
  const [quizQnsAns, setQuizQnsAns] = useState([]);

  useEffect(() => {
    fetchQnsAns();
  }, []);

  const fetchQnsAns = async (prompt) => {

    try {
      const result = await model.generateContent(prompt);
      let responseText =
        result?.response?.candidates[0]?.content?.parts[0]?.text || "";

      // Remove backticks (if present) and parse the JSON string
      try {
        if (responseText.startsWith("```json")) {
          responseText = responseText.replace(/```json|```/g, "").trim();
        }

        const questionsArray = JSON.parse(responseText);
        console.log(questionsArray);
        setQuizQnsAns(questionsArray);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      console.log("Response: ", responseText);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return { quizQnsAns, fetchQnsAns };
};

export default useFetchQnsAns;

// const data = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple");
// const response = await data.json();
