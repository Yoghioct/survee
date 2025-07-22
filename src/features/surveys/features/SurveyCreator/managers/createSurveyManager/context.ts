import { createContext } from 'react';
import { useDefinedContext } from 'shared/context/useDefinedContext';
import { CreateSurveyManager, useCreateSurveyManager } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/createSurveyManager';

export const SurveyCreatorContext = createContext<
  CreateSurveyManager | undefined
>(undefined);

export const useSurveyCreatorContext = (): CreateSurveyManager =>
  useDefinedContext(SurveyCreatorContext);
