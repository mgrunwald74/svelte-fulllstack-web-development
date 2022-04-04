import type { RequestHandler } from "@sveltejs/kit"
import { api } from './_api'

export const del: RequestHandler = (event) => {
  return api(event)
}

export const patch: RequestHandler = async (event) => {
  const formData = await event.request.formData()
  return api(event, {
    text: formData.get('text') as string,
  })
}