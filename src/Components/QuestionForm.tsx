import {
  VStack,
  Radio,
  RadioGroup,
  Button,
  Text,
  Checkbox,
  Input,
  Textarea,
  Box
} from "@chakra-ui/react";

import { useState, Dispatch, SetStateAction } from "react";

import { Question } from "../interfaces";
import { FormEvent } from "react";

interface Props {
  question: Question;
  setCurrentQuestionNumber: Dispatch<SetStateAction<number>>;
  currentQuestionNumber: number;
}

function QuestionForm({
  question: { title, type, options, rightAnswers },
  setCurrentQuestionNumber,
  currentQuestionNumber,
}: Props) {
  console.log("options === ", options);

  const [savedAnswers, setSavedAnswers] = useState<string[]>([]);

  let content;

  switch (type) {
    case "radio":
      content = (
        <RadioGroup
          onChange={(e) => {
            setSavedAnswers([e]);
          }}
          colorScheme="red"
          name="form-content"
        >
          <VStack spacing="12px" alignItems="flex-start" marginBottom={5}>
            {options?.map((option) => {
              return (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              );
            })}
          </VStack>
        </RadioGroup>
      );
      break;
    case "checkbox":
      content = (
        <VStack spacing="12px" alignItems="flex-start" marginBottom={5}>
          {options?.map((option) => {
            return (
              <Checkbox
                isChecked={savedAnswers.includes(option)}
                key={option}
                value={option}
                colorScheme="red"
                onChange={() => {
                  const prevSavedAnswers = [...savedAnswers];

                  if (prevSavedAnswers.includes(option)) {
                    const currentSavedAnswers = prevSavedAnswers.filter(
                      (item) => item !== option
                    );
                    setSavedAnswers(currentSavedAnswers);
                  } else {
                    setSavedAnswers((prev) => [...prev, option]);
                  }
                }}
              >
                {option}
              </Checkbox>
            );
          })}
        </VStack>
      );
      break;
    case "text":
      content = <Input colorScheme="red" marginBottom={5} variant="outline" placeholder="Ваш вариант ответа" />;
      break;
    case "multi-text":
      content = <Textarea colorScheme="red" marginBottom={5} placeholder="Ваш вариант ответа" />;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("savedAnswers === ", savedAnswers);
    setSavedAnswers([]);
    setCurrentQuestionNumber((prev) => prev + 1);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="form-content">
        <Text fontWeight="bold" marginBottom={5} marginTop={5}>
          {title}
        </Text>
      </label>
      <Box maxW="1000px">
      {content}
      </Box>
      <Button colorScheme="red" type="submit">
        Отправить
      </Button>
    </form>
  );
}

export default QuestionForm;
