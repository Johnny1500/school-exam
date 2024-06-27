import "./App.css";
import {
  ChakraProvider,
  Heading,
  Flex,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import Timer from "./Components/Timer";
import ProgressBar from "./Components/ProgressBar";
import QuestionForm from "./Components/QuestionForm";

import * as data from "./dataset.json";
import { useState, useRef, useEffect } from "react";
import { Question } from "./interfaces";

function App() {
  const [currentQuestionNumber, setCurrentQuestionNumber] =
    useState<number>(-1);

  const [loading, setLoading] = useState<boolean>(true);

  const questions = useRef<Question[]>([]);

  useEffect(() => {
    // Моковый запрос к бекенду
    async function getData() {
      const response: Question[] = await new Promise((resolve) => {
        const { rowQuestions } = data;
        setTimeout(() => resolve(rowQuestions), 500);
      });

      questions.current = response;
      setLoading(false);
      // console.log("questions.current === ", questions.current);
    }

    try {
      getData();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }, []);

  return (
    <ChakraProvider>
      <Box minW="500px">
      {loading ? (
        <Text fontWeight="bold" marginBottom={5} marginTop={5}>
          Загрузка...
        </Text>
      ) : (
        <>
          <Flex alignItems="center" gap="3" mb={3}>
            <Heading as="h1" size="lg">
              Тестирование
            </Heading>
            <Timer />
          </Flex>
          <ProgressBar />
          {currentQuestionNumber === -1 ? (
            <Button
              colorScheme="red"
              marginTop={20}
              onClick={() => setCurrentQuestionNumber((prev) => prev + 1)}
            >
              Начать тест
            </Button>
          ) : currentQuestionNumber === questions.current.length ? (
            <Text fontWeight="bold" marginBottom={5} marginTop={5}>
              Тест закончен
            </Text>
          ) : (
            <QuestionForm
              question={questions.current[currentQuestionNumber]}
              currentQuestionNumber={currentQuestionNumber}
              setCurrentQuestionNumber={setCurrentQuestionNumber}
            />
          )}
        </>
      )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
