export function userProfile(state) {
  let userProfile = {}
  Object.assign(userProfile, state.userProfile)
  return userProfile
}
