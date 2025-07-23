import React from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import ReactMarkdown from 'react-markdown';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';

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

function mapAnswerToValue(answer: string) {
  if (!answer) return 0;
  const a = String(answer).trim().toLowerCase();
  
  // Convert "ya" to 1, "tidak" to 0
  if (a === 'ya' || a === 'yes') return 1;
  if (a === 'tidak' || a === 'no') return 0;

  if (a === 'tidak sama sekali') return 0;
  if (a === 'kurang dari 1 (satu) minggu') return 1;
  if (a === 'lebih dari 1 (satu) minggu') return 2;
  if (a === 'hampir setiap hari') return 3;

  // Try to parse as number
  const n = Number(answer);
  if (!isNaN(n)) return n;
  
  // Default to 0 if can't parse
  return 0;
}

function evalCondition(cond: any, questionsById: any) {
  if (typeof cond.operator === 'string' && cond.operator.startsWith('sum')) {
    const op = cond.operator.slice(3); // e.g. '==', '>=', etc
    const questionIds = Array.isArray(cond.question) ? cond.question : [cond.question];
    const sum = questionIds.reduce((acc: number, qid: any) => {
      let ans = questionsById[qid]?.answer;
      let num = mapAnswerToValue(ans);
      console.log(`Debug Sum: Question ${qid}, Answer: "${ans}", Mapped Value: ${num}, Running Sum: ${acc + num}`);
      return acc + num;
    }, 0);
    const target = Number(cond.value);
    console.log(`Debug Sum Result: Final sum = ${sum}, Target = ${target}, Operator = ${op}, Result = ${
      op === '==' ? sum === target :
      op === '!=' ? sum !== target :
      op === '>' ? sum > target :
      op === '<' ? sum < target :
      op === '>=' ? sum >= target :
      op === '<=' ? sum <= target :
      false
    }`);
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
    
    // For numeric comparisons, convert "ya" to 1 and "tidak" to 0
    if (['>', '<', '>=', '<=', '+', '-'].includes(cond.operator)) {
      left = mapAnswerToValue(left);
      right = Number(right);
    }
    
    switch (cond.operator) {
      case '==': 
        // For equality, also check if "ya" equals 1 or "tidak" equals 0
        if (String(right) === '1' && String(left).trim().toLowerCase() === 'ya') return true;
        if (String(right) === '0' && String(left).trim().toLowerCase() === 'tidak') return true;
        return String(left).trim().toLowerCase() === String(right).trim().toLowerCase();
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
  const { isAdmin } = useCurrentUser();

  let customMessages: string[] = [];
  if (formData?.thankYouLogic && Array.isArray(formData.thankYouLogic)) {
    const questionsById: any = {};

    formData.questions.forEach(q => {
      questionsById[(q as any).draftId || (q as any).id] = q;
    });

    customMessages = formData.thankYouLogic.filter((rule: any, idx: number) => {
      if (!rule || typeof rule !== 'object' || !Array.isArray(rule.conditions)) return false;
      const condResults = rule.conditions.map((cond: any) => evalCondition(cond, questionsById));
      return rule.conditions.every((cond: any, ci: number) => condResults[ci]);
    }).map((rule: any) => rule.message).filter(Boolean);
  }

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

        {/* Admin Debug Section */}
        {isAdmin && (
          <div className="mt-8 border-t pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-red-600 mb-2">🔧 Admin Debug Log</h3>
              <p className="text-sm text-gray-600 mb-4">This section is only visible to administrators</p>
            </div>

            {/* Thank You Logic Debug */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium text-gray-800 mb-2">Thank You Logic:</h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                {JSON.stringify((formData?.thankYouLogic as any[]) || [], null, 2)}
              </pre>
            </div>

            {/* Questions By ID Debug */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium text-gray-800 mb-2">Questions By ID:</h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                {JSON.stringify(
                  formData?.questions?.reduce((acc: any, q: any) => {
                    acc[(q as any).draftId || (q as any).id] = {
                      id: (q as any).id,
                      draftId: (q as any).draftId,
                      title: (q as any).title,
                      type: (q as any).type,
                      answer: (q as any).answer,
                      mappedValue: mapAnswerToValue((q as any).answer)
                    };
                    return acc;
                  }, {}) || {},
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Evaluated Conditions Debug */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium text-gray-800 mb-2">Condition Evaluation:</h4>
              <div className="text-xs bg-white p-3 rounded border">
                {(formData?.thankYouLogic as any[])?.map((rule: any, ruleIndex: number) => {
                  const questionsById: any = {};
                  formData.questions.forEach(q => {
                    questionsById[(q as any).draftId || (q as any).id] = q;
                  });

                  return (
                    <div key={ruleIndex} className="mb-4 border-b pb-3 last:border-b-0">
                      <div className="font-medium text-blue-600 mb-1">Rule {ruleIndex + 1}:</div>
                      <div className="mb-1"><strong>Message:</strong> {rule.message || '[No message]'}</div>
                      <div className="mb-2"><strong>Conditions:</strong></div>
                      {rule.conditions?.map((cond: any, condIndex: number) => {
                        const result = evalCondition(cond, questionsById);
                        
                        // Special handling for sum operations
                        if (typeof cond.operator === 'string' && cond.operator.startsWith('sum')) {
                          const questionIds = Array.isArray(cond.question) ? cond.question : [cond.question];
                          const sumDetails = questionIds.map((qid: any) => {
                            const questionAnswer = questionsById[qid]?.answer;
                            const mappedValue = mapAnswerToValue(questionAnswer);
                            return { qid, answer: questionAnswer, mapped: mappedValue };
                          });
                          const totalSum = sumDetails.reduce((acc: number, item: any) => acc + item.mapped, 0);
                          
                          return (
                            <div key={condIndex} className="ml-4 mb-2 p-2 bg-gray-50 rounded">
                              <div>Condition {condIndex + 1}: <span className={result ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{result ? 'TRUE' : 'FALSE'}</span></div>
                              <div>Operator: {cond.operator}</div>
                              <div>Expected Value: {cond.value}</div>
                              <div>Sum Calculation:</div>
                              <div className="ml-4 text-xs">
                                {sumDetails.map((item: any, i: number) => (
                                  <div key={i}>Q{item.qid}: "{item.answer}" → {item.mapped}</div>
                                ))}
                                <div className="font-bold border-t mt-1 pt-1">Total Sum: {totalSum}</div>
                                <div>Comparison: {totalSum} {cond.operator.slice(3)} {cond.value} = {result ? 'TRUE' : 'FALSE'}</div>
                              </div>
                            </div>
                          );
                        } else {
                          const questionAnswer = questionsById[cond.question]?.answer;
                          const mappedValue = mapAnswerToValue(questionAnswer);
                          
                          return (
                            <div key={condIndex} className="ml-4 mb-2 p-2 bg-gray-50 rounded">
                              <div>Condition {condIndex + 1}: <span className={result ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{result ? 'TRUE' : 'FALSE'}</span></div>
                              <div>Question ID: {cond.question}</div>
                              <div>Operator: {cond.operator}</div>
                              <div>Expected Value: {cond.value}</div>
                              <div>Actual Answer: "{questionAnswer}"</div>
                              <div>Mapped Value: {mappedValue}</div>
                            </div>
                          );
                        }
                      })}
                      <div className="mt-2">
                        <strong>Rule Result:</strong> 
                        <span className={rule.conditions?.every((cond: any) => evalCondition(cond, questionsById)) ? 'text-green-600 font-bold ml-1' : 'text-red-600 font-bold ml-1'}>
                          {rule.conditions?.every((cond: any) => evalCondition(cond, questionsById)) ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>
                  );
                }) || []}
              </div>
            </div>

            {/* Custom Messages Debug */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium text-gray-800 mb-2">Generated Messages:</h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                {JSON.stringify(customMessages, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
