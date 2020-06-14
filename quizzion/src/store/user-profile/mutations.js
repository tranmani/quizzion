export function updateUserProfile(state, payload) {
  Object.assign(state.userProfile, payload.profile)
}
