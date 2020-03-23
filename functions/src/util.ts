import * as querystring from 'querystring'
import * as express from 'express'
import {API_DATA} from './types'

export function parseQueryStringToArray(req: express.Request) {
  const numbersTriedStr = req.query.numbersTried
    ? `${req.query.numbersTried}`
    : ''
  const numbers = numbersTriedStr.split(',').filter(i => i)
  return numbers
}

export function getCurrentUrl(req: express.Request) {
  if (req.host === 'localhost' || req.host.endsWith('ngrok.io')) {
    // tslint:disable-next-line: prefer-template
    return req.protocol + '://' + req.get('host') + req.originalUrl
  }

  return API_DATA.baseUri + req.originalUrl
}

export function getCallScreenUrl(req: express.Request) {
  if (req.host === 'localhost') {
    // tslint:disable-next-line: prefer-template
    return req.protocol + '://' + req.get('host') + '/voice/screen'
  }
  // tslint:disable-next-line: prefer-template
  return API_DATA.baseUri + '/voice/screen'
}

export function getFirebaseFunctionCurrentUrl(req: express.Request) {
  return (
    // tslint:disable-next-line: prefer-template
    req.protocol + '://' + process.env.FUNCTION_REGION + '-' + req.originalUrl
  )
}

export function getQueryStringFromArray(numbers: string[]) {
  return querystring.escape(numbers.join(','))
}

export function getNextActionUrl(
  req: express.Request,
  thisDialedNumber?: string
): string {
  const currentUrl = getCurrentUrl(req)
  if (currentUrl.indexOf('numbersTried=') !== -1) {
    return (
      currentUrl +
      (undefined !== thisDialedNumber
        ? querystring.escape(',') + getQueryStringFromArray([thisDialedNumber!])
        : '')
    )
  }
  // tslint:disable-next-line: prefer-template
  return (
    // tslint:disable-next-line: prefer-template
    currentUrl +
    getQueryStringFromArray(parseQueryStringToArray(req)) +
    '?numbersTried=' +
    (undefined !== thisDialedNumber
      ? getQueryStringFromArray([thisDialedNumber!])
      : '')
  )
}
