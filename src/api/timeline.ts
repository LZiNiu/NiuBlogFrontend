import http from '@/utils/http'

export function fetchTimelineList() {
  return http.get<Api.Timeline[]>('/timeline')
}
