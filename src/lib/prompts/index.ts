import type { ArtifactType } from "../schemas/artifacts";

export function buildPrompt(artifactType: ArtifactType, brief: string): string {
  const baseRules = `
You are an AI delivery consultant. Output must be valid JSON only.
No markdown, no backticks, no commentary.
`;

  const perType = {
    PRD: `Generate a PRD JSON with: title, problemStatement, goals, nonGoals, targetUsers, scope(inScope,outOfScope), functionalRequirements[{id,description,priority}], nonFunctionalRequirements[{id,category,description}], assumptions, dependencies, successMetrics, risks[{id,description,mitigation}].`,
    Backlog: `Generate a Backlog JSON with: productArea, epics[{id,title,goal,stories[{id,title,userStory,acceptanceCriteria,priority,estimate?,relatedRequirementIds,tags}]}].`,
    RiskRegister: `Generate a RiskRegister JSON with: context, risks[{id,category,risk,likelihood(1-5),impact(1-5),mitigation,owner?,status}].`,
    QAPack: `Generate a QAPack JSON with: featureUnderTest, testCases[{id,title,type,preconditions,steps,expectedResults,testData}], checklist.`,
    CriticReport: `Generate a CriticReport JSON with: summary, ambiguities, inconsistencies, missingInformationQuestions, risksOrConcerns, recommendedNextSteps.`,
  } as const;

  return `${baseRules}\nArtifact type: ${artifactType}\n${perType[artifactType]}\nUser brief:\n${brief}`;
}

export function buildRepairPrompt(artifactType: ArtifactType, raw: string, error: string): string {
  return `
You previously produced invalid JSON for artifact type ${artifactType}.
Fix it. Output must be valid JSON ONLY and conform to the required fields.
Do not add any extra keys unless required.
Validation error:
${error}

Your previous output:
${raw}
`;
}
