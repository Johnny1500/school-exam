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
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(
    () =>
      localStorage.getItem("currentQuestionNumber")
        ? // eslint-disable-next-line
          // @ts-ignore
          +JSON.parse(localStorage.getItem("currentQuestionNumber"))
        : -1
  );
  const [loading, setLoading] = useState<boolean>(true);
  // const [timeInSeconds, setTimeInSeconds] = useState<number>(900);
  const [timeInSeconds, setTimeInSeconds] = useState<number>(() =>
    localStorage.getItem("timeInSeconds")
      ? // eslint-disable-next-line
        // @ts-ignore
        +JSON.parse(localStorage.getItem("timeInSeconds"))
      : 900
  );

  const questions = useRef<Question[]>([]);
  const timerRef = useRef<NodeJS.Timer | number | null>(null);

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
    } finally {
      // if (localStorage.getItem("timeInSeconds")) {
      //   timerRef.current = setInterval(() => {
      //     setTimeInSeconds((prev) => prev - 1);
      //     localStorage.setItem("timeInSeconds", JSON.stringify(timeInSeconds));
      //   }, 1000);
      // }
    }

    return () => {
      questions.current = [];

      // localStorage.setItem("test", "test");

      if (timerRef.current) {
        // localStorage.setItem(
        //   "timeInSeconds",
        //   JSON.stringify(timeInSeconds - 1)
        // );
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // useEffect(() => {
  //   console.log('tick');
  // }, [timeInSeconds])

  useEffect(() => {
    if (questions.current.length > 0) {
      if (
        currentQuestionNumber === questions.current.length ||
        timeInSeconds === 0
      ) {
        localStorage.clear();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  }, [currentQuestionNumber, timeInSeconds]);

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
              {currentQuestionNumber === questions.current.length ||
              timeInSeconds === 0 ? null : (
                <Timer seconds={timeInSeconds} />
              )}
            </Flex>
            <ProgressBar
              amountOfQuestions={questions.current.length}
              currentQuestionNumber={currentQuestionNumber}
            />
            {currentQuestionNumber === -1 ? (
              <Button
                colorScheme="red"
                marginTop={20}
                onClick={() => {
                  setCurrentQuestionNumber((prev) => prev + 1);
                  localStorage.setItem(
                    "currentQuestionNumber",
                    JSON.stringify(currentQuestionNumber + 1)
                  );
                  timerRef.current = setInterval(() => {
                    setTimeInSeconds((prev) => prev - 1);
                  }, 1000);
                }}
              >
                Начать тест
              </Button>
            ) : currentQuestionNumber === questions.current.length ||
              timeInSeconds === 0 ? (
              <Text fontWeight="bold" marginBottom={5} marginTop={10}>
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
