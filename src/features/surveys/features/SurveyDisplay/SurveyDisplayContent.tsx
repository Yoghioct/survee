import React, { useState } from 'react';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import OneQuestionView from 'features/surveys/features/SurveyDisplay/components/OneQuestionView/OneQuestionView';
import AllQuestionsView from 'features/surveys/features/SurveyDisplay/components/AllQuestionsView/AllQuestionsView';
import MultiStepView from 'features/surveys/features/SurveyDisplay/components/MultiStepView/MultiStepView';
import SurveyNoActive from 'features/surveys/features/SurveyDisplay/components/SurveyNoActive/SurveyNoActive';
import ThankYou from 'features/surveys/features/SurveyDisplay/components/ThankYou';
import clsx from 'clsx';
import NoSurveys from '/public/images/no-surveys.svg';
import Image from 'next/image';
import Logo from 'layout/Logo/Logo';
import LogoCompany from 'layout/Logo/LogoCompany';

export default function SurveyDisplayContent() {
  const { formData, isSurveyFinished, previewMode } = useSurveyDisplayContext();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [disclaimerNext, setDisclaimerNext] = useState(false);

  if (isSurveyFinished) {
    return (
      <div className={clsx(previewMode && 'mb-12 mt-6')}>
        <ThankYou />
      </div>
    );
  }

  // Ensure isActive is properly converted to boolean
  const isActiveBoolean = (formData?.isActive as any) === 1 || formData?.isActive === true || (formData?.isActive as any) === "1";

  if (!isActiveBoolean) {
    return <SurveyNoActive />;
  }

  if (formData?.showDisclaimer && !disclaimerNext) {
    return (
      <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded shadow border">
        {formData.disclaimerTitle && (
          <div className="text-lg font-semibold mb-2 text-gray-800">
            {formData.disclaimerTitle}
          </div>
        )}
        <div className="max-h-96 overflow-y-auto border p-3 mb-4 bg-gray-50 rounded text-left">
          <div className="prose prose-gray prose-sm"
            dangerouslySetInnerHTML={{ __html: formData.disclaimerBody || '' }}
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            id="disclaimer-checkbox"
            type="checkbox"
            className="mr-2 accent-purple-600"
            checked={disclaimerAccepted}
            onChange={e => setDisclaimerAccepted(e.target.checked)}
          />
          <label htmlFor="disclaimer-checkbox" className="select-none text-sm text-gray-700">
            Saya setuju dengan disclaimer di atas
          </label>
        </div>
        <button
          className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50 w-full"
          disabled={!disclaimerAccepted}
          onClick={() => setDisclaimerNext(true)}
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
          <div className='flex justify-center m-6'>
            <LogoCompany width={220} />
          </div>
      {(() => {
        const hasSectionBreakers = formData?.questions?.some(q => q.type === 'SECTION_BREAKER');
        
        if (formData?.oneQuestionPerStep) {
          return <OneQuestionView />;
        } else if (hasSectionBreakers && !formData?.oneQuestionPerStep) {
          return <MultiStepView />;
        } else {
          return <AllQuestionsView />;
        }
      })()}
          {formData?.questions?.length === 0 && (
              <p>There are no questions in this survey</p>
      )}
    </div>
  );
}
