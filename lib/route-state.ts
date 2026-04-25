// Lưu tạm trạng thái trang để khi quay lại vẫn giữ vị trí cuộn, bộ lọc và ô nhập.

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

// Lưu trạng thái danh sách chiến dịch trước khi người dùng rời trang.
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

// Khôi phục trạng thái danh sách chiến dịch khi người dùng quay lại.
export function restoreCampaignListState(): CampaignListState | null {
  if (typeof window === 'undefined') return null
  
  const stored = sessionStorage.getItem('marketing:list-state')
  return stored ? JSON.parse(stored) : null
}

// Lưu bộ lọc và vị trí cuộn của trang trạng thái trước khi chuyển trang.
export function saveStatusListState(statusFilter: string): void {
  if (typeof window === 'undefined') return
  
  const state: StatusListState = {
    pathname: '/marketing/status',
    scrollY: window.scrollY || 0,
    statusFilter,
  }
  
  sessionStorage.setItem('marketing:status-state', JSON.stringify(state))
}

// Khôi phục trạng thái trang trạng thái khi người dùng quay lại.
export function restoreStatusListState(): StatusListState | null {
  if (typeof window === 'undefined') return null
  
  const stored = sessionStorage.getItem('marketing:status-state')
  return stored ? JSON.parse(stored) : null
}

// Ghi nhớ trang marketing vừa xem để có đường quay lại phù hợp.
export function saveLastRoute(pathname: string): void {
  if (typeof window === 'undefined') return
  
  sessionStorage.setItem('marketing:last-route', pathname)
}

// Lấy lại trang marketing đã xem gần nhất.
export function getLastRoute(): string | null {
  if (typeof window === 'undefined') return null
  
  return sessionStorage.getItem('marketing:last-route')
}

// Khôi phục vị trí cuộn sau khi nội dung trang đã sẵn sàng.
export function restoreScrollPosition(scrollY: number): void {
  if (typeof window === 'undefined' || scrollY === 0) return
  
  // Đợi trình duyệt vẽ xong rồi mới cuộn về vị trí cũ.
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
  })
}
