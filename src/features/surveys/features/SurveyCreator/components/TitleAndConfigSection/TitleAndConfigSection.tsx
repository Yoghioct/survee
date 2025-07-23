import {
  ArrowLeftIcon,
  CogIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/outline';
import SurveyOptionsModalModal from 'features/surveys/components/SurveyOptionsModal/SurveyOptionsModal';
import useModal from 'features/surveys/hooks/useModal';
import useTranslation from 'next-translate/useTranslation';

import React, { useState, useEffect } from 'react';
import Button, {
  ButtonSize,
  ButtonVariant,
} from 'shared/components/Button/Button';
import Input, { InputSize } from 'shared/components/Input/Input';
import { MAX_TITLE_LENGTH } from 'shared/constants/surveysConfig';
import { useSurveyCreatorContext } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/context';
import { usePreviewPanelContext } from 'features/surveys/features/SurveyCreator/managers/previewPanelManager/context';
import Toggle from 'shared/components/Toggle/Toggle';
import dynamic from 'next/dynamic';
import Select from 'react-select';
import { CompanyManager, Company } from 'features/company/companyManager';

//Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse"></div>,
});

// Import Quill CSS
import 'react-quill/dist/quill.snow.css';

const LOGIC_OPERATORS = [
  '==', '!=', '>', '<', '>=', '<=', '+', '-', 'contains'
];

export default function TitleAndConfigSection() {
  const { t } = useTranslation('surveyCreate');

  const {
    title,
    error,
    handleChangeTitle,
    surveyOptions,
    updateSurveyOptions,
    isEditMode,
    setIsTemplatePicked,
    showDisclaimer,
    setShowDisclaimer,
    disclaimerTitle,
    setDisclaimerTitle,
    disclaimerBody,
    setDisclaimerBody,
    thankYouLogic,
    setThankYouLogic,
    questions,
    associatedCompanies,
    setAssociatedCompanies,
  } = useSurveyCreatorContext();

  const { togglePanel, isPanelOpened } = usePreviewPanelContext();

  const {
    isModalOpen: isOptionsModalOpen,
    closeModal: closeOptionsSurveyModal,
    openModal: openOptionsSurveyModal,
  } = useModal();

  const [disclaimerOpen, setDisclaimerOpen] = useState(showDisclaimer);
  const [thankYouLogicOpen, setThankYouLogicOpen] = useState(false);
  const [thankYouLogicEnabled, setThankYouLogicEnabled] = useState(false);
  
  // Company visibility state
  const [companyVisibilityOpen, setCompanyVisibilityOpen] = useState(false);
  const [companyVisibilityEnabled, setCompanyVisibilityEnabled] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Inisialisasi toggle dan open jika thankYouLogic sudah ada
  useEffect(() => {
    if (thankYouLogic && thankYouLogic.length > 0) {
      setThankYouLogicEnabled(true);
      setThankYouLogicOpen(true);
    }
  }, [thankYouLogic]);

  // Initialize company visibility based on existing associated companies
  useEffect(() => {
    if (associatedCompanies && associatedCompanies.length > 0) {
      setCompanyVisibilityEnabled(true);
      setCompanyVisibilityOpen(true);
      setSelectedCompanies(associatedCompanies);
    }
  }, [associatedCompanies]);

  // Also initialize when companies are loaded and we have associated companies
  useEffect(() => {
    if (companies.length > 0 && associatedCompanies && associatedCompanies.length > 0) {
      setCompanyVisibilityEnabled(true);
      setCompanyVisibilityOpen(true);
      setSelectedCompanies(associatedCompanies);
    }
  }, [companies, associatedCompanies]);

  // Load companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const companiesData = await CompanyManager.getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, []);

  // Update associated companies when selection changes
  useEffect(() => {
    if (companyVisibilityEnabled) {
      setAssociatedCompanies(selectedCompanies);
    } else {
      setAssociatedCompanies([]);
    }
  }, [selectedCompanies, companyVisibilityEnabled, setAssociatedCompanies]);

  useEffect(() => {
    // Normalisasi: pastikan question pada sum condition selalu array
    if (thankYouLogic && thankYouLogic.length > 0) {
      let changed = false;
      const newLogic = thankYouLogic.map((rule: any) => ({
        ...rule,
        conditions: rule.conditions.map((cond: any) => {
          if (
            typeof cond.operator === 'string' &&
            cond.operator.startsWith('sum') &&
            cond.question &&
            !Array.isArray(cond.question)
          ) {
            changed = true;
            return { ...cond, question: [cond.question] };
          }
          return cond;
        }),
      }));
      if (changed) setThankYouLogic(newLogic);
    }
  }, [thankYouLogic, setThankYouLogic]);

  useEffect(() => {
    if (thankYouLogic && thankYouLogic.length > 0) {
      let changed = false;
      const newLogic = thankYouLogic.map((rule: any) => ({
        ...rule,
        conditions: rule.conditions.map((cond: any) => {
          if (
            typeof cond.operator === 'string' &&
            !cond.operator.startsWith('sum') &&
            Array.isArray(cond.question)
          ) {
            changed = true;
            return { ...cond, question: cond.question[0] || '' };
          }
          return cond;
        }),
      }));
      if (changed) setThankYouLogic(newLogic);
    }
  }, [thankYouLogic, setThankYouLogic]);

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  // Helper: get question label
  const getQuestionLabel = (q: any, idx: number) => `Q${idx + 1}: ${q.title}`;

  // Handler: add rule
  const addRule = () => {
    setThankYouLogic([
      ...thankYouLogic,
      { conditions: [{ question: '', operator: '==', value: '' }], message: '' },
    ]);
  };
  // Handler: remove rule
  const removeRule = (i: number) => {
    setThankYouLogic(thankYouLogic.filter((_: any, idx: number) => idx !== i));
  };
  // Handler: update rule
  const updateRule = (i: number, rule: any) => {
    setThankYouLogic(thankYouLogic.map((r: any, idx: number) => (idx === i ? rule : r)));
  };
  // Handler: add condition to rule
  const addCondition = (i: number) => {
    const rule = thankYouLogic[i];
    updateRule(i, { ...rule, conditions: [...rule.conditions, { question: '', operator: '==', value: '' }] });
  };
  // Handler: remove condition from rule
  const removeCondition = (i: number, ci: number) => {
    const rule = thankYouLogic[i];
    updateRule(i, { ...rule, conditions: rule.conditions.filter((_: any, idx: number) => idx !== ci) });
  };
  // Handler: update condition in rule
  const updateCondition = (i: number, ci: number, cond: any) => {
    const rule = thankYouLogic[i];
    const newConds = rule.conditions.map((c: any, idx: number) => (idx === ci ? { ...c, ...cond } : c));
    updateRule(i, { ...rule, conditions: newConds });
  };

  return (
    <>
      
      <div className="flex flex-col gap-x-2 sm:flex-row">
        {!isEditMode && (
          <Button
            className="mb-2"
            onClick={() => {
              setIsTemplatePicked(false);
            }}
            sizeType={ButtonSize.SMALL}
            icon={<ArrowLeftIcon className="mr-1 h-5 w-5" />}
          >
            Back
          </Button>
        )}

        <div className="w-full">
          <Input
            className="mt-0"
            name="survey-title"
            placeholder={t('surveyTitlePlaceholder')}
            value={title}
            error={error}
            maxLength={MAX_TITLE_LENGTH}
            onChange={handleChangeTitle}
            inputSize={InputSize.SMALL}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-grow whitespace-nowrap"
            variant={ButtonVariant.PRIMARY}
            onClick={openOptionsSurveyModal}
            icon={<CogIcon className="h-5 w-5" />}
            data-test-id="options-button"
            sizeType={ButtonSize.SMALL}
          >
            <span className="ms-1">{t('options')}</span>
          </Button>
          <Button
            onClick={togglePanel}
            variant={ButtonVariant.PRIMARY}
            sizeType={ButtonSize.SMALL}
            icon={
              isPanelOpened ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )
            }
            data-test-id="preview-button"
          />
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <div className="flex items-center mb-2 font-semibold text-gray-700">
          <button
            type="button"
            className="btn relative flex items-center justify-center btn-secondary h-[38px] px-3 py-1 text-sm bg-secondary-50 mr-2"
            // onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            onClick={() => {
              if (showDisclaimer) {
                setDisclaimerOpen(!disclaimerOpen);
              }
            }}
            aria-label={disclaimerOpen ? 'Tutup disclaimer' : 'Buka disclaimer'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className={`w-[15px] transition-transform ${disclaimerOpen ? '' : '-rotate-90'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <span className="flex-1">Disclaimer</span>
          <Toggle
            isEnabled={showDisclaimer}
            onToggle={v => { setShowDisclaimer(v); if (v) setDisclaimerOpen(true); }}
            classNames="ml-2"
          />
        </div>
        {showDisclaimer && disclaimerOpen && (
          <div className="space-y-2 mt-2">
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Title disclaimer"
              value={disclaimerTitle}
              onChange={e => setDisclaimerTitle(e.target.value)}
            />
            <div className="border rounded">
              <ReactQuill
                theme="snow"
                value={disclaimerBody}
                onChange={setDisclaimerBody}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter a disclaimer..."
                style={{ 
                  minHeight: '120px',
                  fontSize: '14px'
                }}
                className="quill-editor-custom"
              />
            </div>
            {/* <div className="text-xs text-gray-500 mb-2">
              Gunakan toolbar di atas untuk format teks: <b>tebal</b>, <i>miring</i>, <u>garis bawah</u>, dll.
            </div> */}
          </div>
        )}
      </div>

      {/* Custom Thank You Logic Section */}
      <div className="mt-4 p-4 border rounded bg-gray-50 w-full">
        <div className="flex items-center mb-2 font-semibold text-gray-700">
          <button
            type="button"
            className="btn relative flex items-center justify-center btn-secondary h-[38px] px-3 py-1 text-sm bg-secondary-50 mr-2"
            onClick={() => {
              if (thankYouLogicEnabled) {
                setThankYouLogicOpen(!thankYouLogicOpen);
              }
            }}
            aria-label={thankYouLogicOpen ? 'Tutup custom thank you logic' : 'Buka custom thank you logic'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className={`w-[15px] transition-transform ${thankYouLogicOpen ? '' : '-rotate-90'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <span className="flex-1">Custom Thank You Logic</span>
          <Toggle
            isEnabled={thankYouLogicEnabled}
            onToggle={v => { 
              setThankYouLogicEnabled(v); 
              if (v) {
                setThankYouLogicOpen(true);
              } else {
                setThankYouLogicOpen(false);
              }
            }}
            classNames="ml-2"
          />
        </div>
        {thankYouLogicEnabled && thankYouLogicOpen && (
          <div className="space-y-4 mt-2 w-full">
            {thankYouLogic.map((rule: any, i: number) => (
              <div key={i} className="border rounded p-3 bg-white w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-gray-700">Rule {i + 1}</span>
                  <button 
                    type="button" 
                    className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50" 
                    onClick={() => removeRule(i)}
                  >
                    Delete Rule
                  </button>
                </div>
                {rule.conditions.map((cond: any, ci: number) => (
                  <div key={ci} className="space-y-2 mb-3">
                    <div className="flex flex-col sm:flex-row gap-2 w-full items-end">
                      <div className="flex-1 min-w-0">
                        {/* Jika operator sum, gunakan react-select multi */}
                        {typeof cond.operator === 'string' && cond.operator.startsWith('sum') ? (
                          <>
                            <Select
                              isMulti
                              options={questions.map((q: any, idx: number) => ({
                                value: q.draftId || q.id,
                                label: getQuestionLabel(q, idx),
                              }))}
                              value={
                                Array.isArray(cond.question)
                                  ? cond.question.map((qid: string) => {
                                      const q = questions.find((qq: any) => (qq.draftId || qq.id) === qid);
                                      return q
                                        ? { value: qid, label: getQuestionLabel(q, questions.indexOf(q)) }
                                        : null;
                                    }).filter(Boolean)
                                  : cond.question
                                    ? [{
                                        value: cond.question,
                                        label:
                                          (() => {
                                            const q = questions.find((qq: any) => (qq.draftId || qq.id) === cond.question);
                                            return q ? getQuestionLabel(q, questions.indexOf(q)) : cond.question;
                                          })()
                                      }]
                                    : []
                              }
                              onChange={selected => {
                                updateCondition(i, ci, { question: selected.map((s: any) => s.value) });
                              }}
                              classNamePrefix="react-select"
                              placeholder="Select question..."
                              styles={{
                                valueContainer: (base) => ({
                                  ...base,
                                  justifyContent: 'flex-start',  // paksa kiri
                                  padding: '2px 8px',
                                }),
                                option: (base, { isFocused, isSelected }) => ({
                                  ...base,
                                  textAlign: 'left',
                                  backgroundColor: isFocused
                                    ? '#eee'
                                    : isSelected
                                    ? '#ddd'
                                    : base.backgroundColor,
                                }),
                              }}
                            />
                          </>
                        ) : (
                          <select
                            className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            value={
                              Array.isArray(cond.question)
                                ? cond.question[0] || ''
                                : cond.question || ''
                            }
                            onChange={e => updateCondition(i, ci, { question: e.target.value })}
                          >
                            <option value="">Select question...</option>
                            {questions.map((q: any, idx: number) => (
                              <option key={q.draftId || q.id} value={q.draftId || q.id}>{getQuestionLabel(q, idx)}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <select
                          className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={cond.operator}
                          onChange={e => updateCondition(i, ci, { operator: e.target.value })}
                        >
                          {/* Grouped operator options */}
                          <optgroup label="Comparison Operators">
                            {LOGIC_OPERATORS.map((op: string) => (
                              <option key={op} value={op}>{op}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Summation (sum)">
                            <option value="sum==">sum ==</option>
                            <option value="sum!=">sum !=</option>
                            <option value="sum>">sum &gt;</option>
                            <option value="sum<">sum &lt;</option>
                            <option value="sum>=">sum &gt;=</option>
                            <option value="sum<=">sum &lt;=</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Untuk sum, value harus number */}
                        {typeof cond.operator === 'string' && cond.operator.startsWith('sum') ? (
                          <input
                            type="number"
                            className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            value={cond.value}
                            onChange={e => updateCondition(i, ci, { value: e.target.value })}
                            placeholder="Enter a sum value"
                          />
                        ) : (
                          <input
                            className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            value={cond.value}
                            onChange={e => updateCondition(i, ci, { value: e.target.value })}
                            placeholder="Enter a value"
                          />
                        )}
                      </div>
                      {rule.conditions.length > 1 && (
                        <div className="flex-shrink-0 w-full sm:w-auto">
                          <button 
                            type="button" 
                            className="w-full sm:w-auto px-3 py-2 h-10 text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded transition-colors duration-200" 
                            onClick={() => removeCondition(i, ci)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="text-xs text-purple-600 hover:text-purple-800 transition-colors mb-3 px-2 py-1 rounded hover:bg-purple-50" 
                  onClick={() => addCondition(i)}
                >
                  + Add Condition
                </button>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Message if rule matches</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-y"
                    rows={3}
                    placeholder="Message to display if condition is met"
                    value={rule.message}
                    onChange={e => updateRule(i, { ...rule, message: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <button 
              type="button" 
              className="text-xs text-purple-600 hover:text-purple-800 transition-colors px-3 py-2 rounded border border-purple-200 hover:bg-purple-50 w-full sm:w-auto" 
              onClick={addRule}
            >
              + Add Rule
            </button>
          </div>
        )}
      </div>

      {/* Company Visibility Section */}
      <div className="mt-4 p-4 border rounded bg-gray-50 w-full">
        <div className="flex items-center mb-2 font-semibold text-gray-700">
          <button
            type="button"
            className="btn relative flex items-center justify-center btn-secondary h-[38px] px-3 py-1 text-sm bg-secondary-50 mr-2"
            onClick={() => {
              if (companyVisibilityEnabled) {
                setCompanyVisibilityOpen(!companyVisibilityOpen);
              }
            }}
            aria-label={companyVisibilityOpen ? 'Tutup company visibility' : 'Buka company visibility'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className={`w-[15px] transition-transform ${companyVisibilityOpen ? '' : '-rotate-90'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <span className="flex-1">Company Visibility</span>
          <Toggle
            isEnabled={companyVisibilityEnabled}
            onToggle={v => { 
              setCompanyVisibilityEnabled(v); 
              if (v) {
                setCompanyVisibilityOpen(true);
              } else {
                setCompanyVisibilityOpen(false);
                setSelectedCompanies([]);
              }
            }}
            classNames="ml-2"
          />
        </div>
        {companyVisibilityEnabled && companyVisibilityOpen && (
          <div className="space-y-3 mt-2 w-full">
            
            {loadingCompanies ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                <span className="ml-2 text-gray-600">Loading companies...</span>
              </div>
            ) : (
              <Select
                isMulti
                options={companies.map(company => ({
                  value: company.id,
                  label: company.name,
                }))}
                value={companies
                  .filter(company => selectedCompanies.includes(company.id))
                  .map(company => ({
                    value: company.id,
                    label: company.name,
                  }))
                }
                onChange={selected => {
                  setSelectedCompanies(selected ? selected.map(s => s.value) : []);
                }}
                classNamePrefix="react-select"
                placeholder="Choose a company..."
                noOptionsMessage={() => "No companies found"}
                styles={{
                  valueContainer: (base) => ({
                    ...base,
                    justifyContent: 'flex-start',
                    padding: '2px 8px',
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    textAlign: 'left',
                    backgroundColor: isFocused
                      ? '#eee'
                      : isSelected
                      ? '#ddd'
                      : base.backgroundColor,
                  }),
                }}
              />
            )}
            
          </div>
        )}
      </div>

      <SurveyOptionsModalModal
        isOpened={isOptionsModalOpen}
        closeModal={closeOptionsSurveyModal}
        surveyOptions={surveyOptions}
        updateOptions={updateSurveyOptions}
      />
    </>
  );
}
