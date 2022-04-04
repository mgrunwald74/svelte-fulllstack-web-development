import type { RequestHandler } from "@sveltejs/kit"
import { api } from './_api'


export const get: RequestHandler = async (event) => {
  return api(event)
}

export const post: RequestHandler = async (event) => {
  const formData = await event.request.formData()
  return api(event, {
    uid:`${Math.floor(Math.random() * 1024)}`,
    created_at: new Date(),
    text: formData.get('text') as string,
    done: false
  })
}