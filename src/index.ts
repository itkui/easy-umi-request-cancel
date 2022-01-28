import { abortMaps } from './utils/abort'
import { signalMerge, errorMerge, cancelKeyCheck } from './utils/utils'
import { OnionMiddleware } from 'umi-request'

const umiRequestCancel: OnionMiddleware = async ({ req: { options }, req }, next) => {
  const cancelKeySymbol = cancelKeyCheck(options, req.url)
  if (!cancelKeySymbol) {
    return await next();
  }

  signalMerge(options, cancelKeySymbol)
  errorMerge(options, (error) => {
    // 如果出现非中断请求错 误，这里需要将此次的AbortController清除掉，防止内存泄漏
    if (error.type !== "AbortError") {
      abortMaps.delete(cancelKeySymbol);
    }
  })

  await next();
  abortMaps.delete(cancelKeySymbol);
}

export default umiRequestCancel