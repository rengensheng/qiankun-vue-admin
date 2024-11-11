export type Notification = {
  id: string
  userId: string
  title: string
  content: string
  type: 'notification' | 'reminder' | 'other'
  status: 'unsent' | 'sent' | 'read'
  link?: string
  createdTime: Date
  updatedTime: Date
}
