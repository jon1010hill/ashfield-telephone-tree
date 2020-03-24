import {
  TwilioInboundCallData,
  InboundCallData,
  isValidInboundCallData
  // isValidInboundCallData
} from './types'

export class TwilioUtil {
  toInboundCallData(twilioData: TwilioInboundCallData): InboundCallData {
    const data = {
      to: twilioData.From,
      from: twilioData.To,
      called: twilioData.Called
    }
    if (!isValidInboundCallData(data)) {
      throw new Error('Invalid InBoundCallData')
    }
    return data
  }
}
