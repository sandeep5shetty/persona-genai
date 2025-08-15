export interface Persona {
  id: string
  name: string
  title: string
  bio: string
  avatar: string
  specialties: string[]
  style: {
    voice: string
    traits: string[]
  }
  tunes: string[]
  genAICourse: {
    promoteLine: string
    courseLink: string
    examples: string[]
  }
}
