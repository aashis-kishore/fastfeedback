import React, { 
  useState, 
  useEffect, 
  useContext, 
  createContext, 
  useCallback
} from 'react'
import firebase from './firebase'

const authContext = createContext()

export function AuthProvider({children}) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState(null)

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser)

      setUser(user)
      return user
    } else {
      setUser(user)
      return false
    }
  }

  const signInWithGithub = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => handleUser(response.user))
  }

  const signOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onIdTokenChanged((user) => handleUser(user))

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    user: user,
    signInWithGithub,
    signOut
  }
}

const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId
  }
}