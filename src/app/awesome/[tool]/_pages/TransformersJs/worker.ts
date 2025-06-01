/* eslint-disable no-restricted-globals */
import { env, pipeline } from '@huggingface/transformers'

import type { AllTasks, ProgressCallback } from '@huggingface/transformers'

// Skip local model check
env.allowLocalModels = false

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
  static task = 'text-classification' as const
  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
  static instance: Promise<AllTasks['text-classification']> | null = null

  static async getInstance(progressCallback: ProgressCallback) {
    if (this.instance === null) {
      // ref: https://github.com/huggingface/transformers.js/issues/1299
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      this.instance = pipeline(this.task, this.model, { progress_callback: progressCallback })
    }
    return this.instance
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  // Retrieve the classification pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  const classifier = await PipelineSingleton.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x)
  })

  // Actually perform the classification
  const output = await classifier(event.data.text)

  // Send the output back to the main thread
  self.postMessage({
    status: 'complete',
    output,
  })
})
