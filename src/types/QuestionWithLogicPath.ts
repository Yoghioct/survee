// Remove import from @prisma/client if Question is not exported
// Define a fallback type for Question if needed
export type QuestionWithLogicPath = {
  // Define the properties you need from Question here, or use any
  [key: string]: any;
  logicPaths: any[];
};
