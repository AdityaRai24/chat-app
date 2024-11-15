export const createAuthSlice = (set)=>({
    chatDetails : undefined,
    setUserInfo : (chatDetails)=>set({chatDetails})
})