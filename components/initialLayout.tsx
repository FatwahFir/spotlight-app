import { useAuth } from '@clerk/clerk-expo'
import { router, Stack, useSegments } from 'expo-router'
import React, { useEffect } from 'react'

export default function InitialLayout() {
    const {isLoaded, isSignedIn} = useAuth()
    const segments = useSegments()

    useEffect(()=>{
        if(!isLoaded) return

        const inAuthScreen = segments[0] == '(auth)'

        if(!isSignedIn && !inAuthScreen) router.replace('/(auth)/login')
        else if(isSignedIn && inAuthScreen) router.replace('/(tabs)')
    }, [isLoaded, isSignedIn, segments])

    if(!isLoaded) return null

    return <Stack screenOptions={{ headerShown: false }}/>
}