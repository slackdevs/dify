import type { CommonNodeType } from '@/app/components/workflow/types'
import type { ToolVarInputs } from '../tool/types'

export type AgentNodeType = CommonNodeType & {
  agent_strategy_provider_name?: string
  agent_strategy_name?: string
  agent_strategy_label?: string
  agent_parameters?: Record<string, any>
  agent_configurations?: Record<string, ToolVarInputs>
  output_schema: Record<string, any>
}