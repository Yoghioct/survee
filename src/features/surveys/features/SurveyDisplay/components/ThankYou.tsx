import React from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import ReactMarkdown from 'react-markdown';
import { CheckCircleIcon } from '@heroicons/react/solid';

// function mapAnswerToScore(answer: string) {
//   if (!answer) return 0;
//   const a = answer.toLowerCase();
//   if (a.includes('tidak sama sekali')) return 0;
//   if (a.includes('kurang dari 1')) return 1;
//   if (a.includes('lebih dari 1')) return 2;
//   if (a.includes('hampir setiap hari')) return 3;
//   const n = Number(answer);
//   if (!isNaN(n)) return n;
//   return 0;
// }

function evalCondition(cond: any, questionsById: any) {
  if (typeof cond.operator === 'string' && cond.operator.startsWith('sum')) {
    const op = cond.operator.slice(3); // e.g. '==', '>=', etc
    const questionIds = Array.isArray(cond.question) ? cond.question : [cond.question];
    const sum = questionIds.reduce((acc: number, qid: any) => {
      let ans = questionsById[qid]?.answer;
      let num = Number(ans);
      if (isNaN(num)) num = 0;
      return acc + num;
    }, 0);
    const target = Number(cond.value);
    switch (op) {
      case '==': return sum === target;
      case '!=': return sum !== target;
      case '>': return sum > target;
      case '<': return sum < target;
      case '>=': return sum >= target;
      case '<=': return sum <= target;
      default: return false;
    }
  }else{
    let left = questionsById[cond.question]?.answer;
    let right = cond.value;
    switch (cond.operator) {
      case '==': return String(left).trim().toLowerCase() === String(right).trim().toLowerCase();
      case '!=': return left != right;
      case '>': return left > right;
      case '<': return left < right;
      case '>=': return left >= right;
      case '<=': return left <= right;
      case '+': return left + right == Number(cond.value);
      case '-': return left - right == Number(cond.value);
      case 'contains': return String(left).includes(String(right));
      default: return false;
    }
  }
}

export default function ThankYou() {
  const { t } = useTranslation('thankyou');
  const { formData } = useSurveyDisplayContext();

  let customMessages: string[] = [];
  if (formData?.thankYouLogic && Array.isArray(formData.thankYouLogic)) {
    const questionsById: any = {};

    formData.questions.forEach(q => {
      questionsById[(q as any).draftId || (q as any).id] = q;
    });


    // console.log('DEBUG thankYouLogic:', formData.thankYouLogic);
    // console.log('DEBUG questionsById:', questionsById);
    customMessages = formData.thankYouLogic.filter((rule: any, idx: number) => {
      if (!rule || typeof rule !== 'object' || !Array.isArray(rule.conditions)) return false;
      const condResults = rule.conditions.map((cond: any) => evalCondition(cond, questionsById));
      return rule.conditions.every((cond: any, ci: number) => condResults[ci]);
    }).map((rule: any) => rule.message).filter(Boolean);
  }

  // console.log('customMessages:', customMessages);

  // if (customMessages.length > 0) {
  //   return <pre>{customMessages}</pre>
  // }

  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-2" />
        <h1
          data-test-id="thank-you-header"
          className="leading-tighter mt-2 text-3xl font-extrabold tracking-tighter text-center"
        >
          {t('firstPartHeading')}&nbsp;
          <span className="text-purple-700">{t('secondPartHeading')}</span>
        </h1>
        <p className="text-md mt-2 max-w-lg text-zinc-600 text-center">{t('content')}</p>
      </div>

      <div className="mt-8 w-full max-w-xl text-left">
        {customMessages.length > 0 ? (
          <>
            <div className="mb-2 text-lg font-semibold text-gray-700 text-center">Hasil:</div>
            {customMessages.map((msg, i) => (
              <div key={i} className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded shadow-sm">
                <ReactMarkdown>{msg || '*[Pesan kosong]*'}</ReactMarkdown>
              </div>
            ))}

          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
