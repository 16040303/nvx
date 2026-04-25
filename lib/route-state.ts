// Route state persistence utility
// Saves and restores page state (scroll position, filter values, input state) across navigation

export interface CampaignListState {
  pathname: string
  scrollY: number
  ideaQuery: string
  postQuantity: string
}

export interface StatusListState {
  pathname: string
  scrollY: number
  statusFilter: string
}

// Save campaign list state before navigation
export function saveCampaignListState(ideaQuery: string, postQuantity: string): void {
  if (typeof window === 'undefined') return
  
  const state: CampaignListState = {
    pathname: '/marketing',
    scrollY: window.scrollY || 0,
    ideaQuery,
    postQuantity,
  }
  
  sessionStorage.setItem('marketing:list-state', JSON.stringify(state))
}

// Restore campaign list state
export function restoreCampaignListState(): CampaignListState | null {
  if (typeof window === 'undefined') return null
  
  const stored = sessionStorage.getItem('marketing:list-state')
  return stored ? JSON.parse(stored) : null
}

// Save status list state before navigation
export function saveStatusListState(statusFilter: string): void {
  if (typeof window === 'undefined') return
  
  const state: StatusListState = {
    pathname: '/marketing/status',
    scrollY: window.scrollY || 0,
    statusFilter,
  }
  
  sessionStorage.setItem('marketing:status-state', JSON.stringify(state))
}

// Restore status list state
export function restoreStatusListState(): StatusListState | null {
  if (typeof window === 'undefined') return null
  
  const stored = sessionStorage.getItem('marketing:status-state')
  return stored ? JSON.parse(stored) : null
}

// Save last visited route for fallback navigation
export function saveLastRoute(pathname: string): void {
  if (typeof window === 'undefined') return
  
  sessionStorage.setItem('marketing:last-route', pathname)
}

// Get last visited route
export function getLastRoute(): string | null {
  if (typeof window === 'undefined') return null
  
  return sessionStorage.getItem('marketing:last-route')
}

// Restore scroll position with a small delay to ensure DOM is ready
export function restoreScrollPosition(scrollY: number): void {
  if (typeof window === 'undefined' || scrollY === 0) return
  
  // Use requestAnimationFrame to ensure scroll happens after paint
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
  })
}
