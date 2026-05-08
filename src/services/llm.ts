import { generateText, Output } from 'ai'
import { z } from 'zod'
import { config } from '../config'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const openai = createOpenAICompatible({
  name: 'openai-compatible',
  baseURL: config.openaiBaseUrl,
  apiKey: config.openaiApiKey,
  supportsStructuredOutputs: true,
})

export async function analyzeRepo(name: string, desc: string, readme: string, orgRepos: { name: string, desc: string }[]) {
  const { output } = await generateText({
    model: openai(config.openaiModel),
    output: Output.object({
      schema: z.object({
        cleanDescription: z.string().describe('A structural and clear description of the repository.'),
        docRepoName: z.string().nullable().describe('The linked documentation repo full name if it exists in the organization, otherwise null.'),
      }),
    }),
    prompt: `Analyze the repository ${name}.
Description: ${desc || 'None'}
README excerpt: ${readme.substring(0, 3000)}

Other repositories in the same organization:
${orgRepos.filter(r => r.name.includes('doc')).map(r => `- ${r.name}: ${r.desc}`).join('\n')}

Task: Provide a clean, structural description of the main repo. Also, if there's a dedicated documentation repository in the organization, identify it.`,
  })
  return output
}
