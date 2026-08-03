import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"
import { ruRU } from '@clerk/localizations'

const RootProvider = ({ children}: {children: ReactNode}) => {
  return (
        <ClerkProvider localization={ruRU}>
         {children}
        </ClerkProvider>
  )
}

export default RootProvider;