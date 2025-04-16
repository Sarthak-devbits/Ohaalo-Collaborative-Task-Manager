export interface IGoggleInfo {
    id: string
    displayName: string
    name: Name
    emails: Email[]
    photos: Photo[]
    provider: string
    _raw: string
    _json: Json
  }
  
  export interface Name {
    familyName: string
    givenName: string
  }
  
  export interface Email {
    value: string
    verified: boolean
  }
  
  export interface Photo {
    value: string
  }
  
  export interface Json {
    sub: string
    name: string
    given_name: string
    family_name: string
    picture: string
    email: string
    email_verified: boolean
  }
  