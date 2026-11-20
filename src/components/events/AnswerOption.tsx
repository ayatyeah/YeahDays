import type {ButtonHTMLAttributes} from 'react';

export default function AnswerOption(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" data-quiz-answer {...props}/>;
}
