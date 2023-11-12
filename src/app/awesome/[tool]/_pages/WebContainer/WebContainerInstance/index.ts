/* eslint-disable no-console */
import { WebContainer } from '@webcontainer/api'

import { files } from './files'

export interface RunScriptOptions {
  onWrite?: (chunk: string) => void
}

let BOOTED_WEB_CONTAINER_INSTANCE: WebContainer

export class WebContainerInstance {
  static async getInstance() {
    if (!BOOTED_WEB_CONTAINER_INSTANCE) {
      BOOTED_WEB_CONTAINER_INSTANCE = await WebContainer.boot()
      await BOOTED_WEB_CONTAINER_INSTANCE.mount(files)
    }
    return BOOTED_WEB_CONTAINER_INSTANCE
  }

  static async installDependencies() {
    const installProcess = await BOOTED_WEB_CONTAINER_INSTANCE.spawn('npm', [
      'install',
    ])
    console.log('install dependencies:')
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data)
        },
      }),
    )
    // Wait for install command to exit
    return installProcess.exit
  }

  static async runScript(name: string, options: RunScriptOptions = {}) {
    const { onWrite } = options
    const result = await BOOTED_WEB_CONTAINER_INSTANCE.spawn('npm', [
      'run',
      name,
    ])
    result.output.pipeTo(
      new WritableStream({
        write(data) {
          onWrite?.(data)
        },
      }),
    )
    return await result.exit
  }

  static async runStart(options: RunScriptOptions = {}) {
    return WebContainerInstance.runScript('start', options)
  }

  static async runTest(options: RunScriptOptions = {}) {
    return WebContainerInstance.runScript('test', options)
  }

  static async writeIndexJS(content: string) {
    await BOOTED_WEB_CONTAINER_INSTANCE.fs.writeFile('/index.js', content)
  }
}
