import { useEffect, useState } from "react";
import { model } from "../constantData/mock_data";
import { useSelector } from "react-redux";


const useFetchQnsAns = () => {
  const [quizQnsAns, setQuizQnsAns] = useState([]);
  const { question } = useSelector((store) => store.quizData);

  useEffect(() => {
    fetchQnsAns();
  }, []);

  const fetchQnsAns = async (prompt) => {

    try {
      if(question.length <= 0) {
        const result = await model.generateContent(prompt);
        let responseText =
          result?.response?.candidates[0]?.content?.parts[0]?.text || "";
        try {
          if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/```json|```/g, "").trim();
          }
          const questionsArray = JSON.parse(responseText);
          setQuizQnsAns(questionsArray);
        } catch (error) {
          console.log("Error parsing JSON:", error);
        }
      }
      else {
        return { quizQnsAns, fetchQnsAns };
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return { quizQnsAns, fetchQnsAns };
};

export default useFetchQnsAns;

// const data = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple");
// const response = await data.json();
