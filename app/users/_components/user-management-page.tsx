'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { ListToolbar } from '@/components/data-list/list-toolbar'
import { TimestampChip } from '@/components/data-list/timestamp-chip'
import { DatePickerModal } from '@/components/data-list/date-picker-modal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

type UserStatus = 'active' | 'disabled'
type UserFilter = 'all' | UserStatus
type UserRole = 'cskhStaff' | 'operationsManager' | 'salesStaff' | 'marketingStaff'

interface ManagedUser {
  id: string
  fullName: string
  email: string
  password: string
  roleKey: UserRole
  lastActive: string
  createdAt: string
  createdBy: string
  status: UserStatus
}

const ITEMS_PER_PAGE = 7

const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'u-1',
    fullName: 'Trần Ngọc Minh',
    email: 'minh.tn@nuverxai.com',
    password: 'Minh210!',
    roleKey: 'marketingStaff',
    lastActive: '14/03/2026, 16:30',
    createdAt: '12/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-2',
    fullName: 'Trần Kiều Giang',
    email: 'giang.tk@nuverxai.com',
    password: 'Giang210!',
    roleKey: 'marketingStaff',
    lastActive: '15/07/2025, 08:17',
    createdAt: '13/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-3',
    fullName: 'Nguyễn Mỹ Linh',
    email: 'linh.nm@nuverxai.com',
    password: 'Linh210!',
    roleKey: 'marketingStaff',
    lastActive: '08/06/2025, 10:30',
    createdAt: '14/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-4',
    fullName: 'Hoàng Thị My',
    email: 'my.ht@nuverxai.com',
    password: 'My210!',
    roleKey: 'marketingStaff',
    lastActive: '14/05/2025, 10:24',
    createdAt: '15/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-5',
    fullName: 'Đặng Anh Thư',
    email: 'thu.dat@nuverxai.com',
    password: 'Thu210!',
    roleKey: 'marketingStaff',
    lastActive: '10/04/2025, 15:10',
    createdAt: '16/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-6',
    fullName: 'Lê Hoàng Thanh',
    email: 'thanh.lh@nuverxai.com',
    password: 'Thanh210!',
    roleKey: 'marketingStaff',
    lastActive: '13/01/2025, 14:10',
    createdAt: '17/03/2026',
    createdBy: 'Phương Thảo',
    status: 'disabled',
  },
  {
    id: 'u-7',
    fullName: 'Võ Hà Cẩm Ly',
    email: 'ly.vhc@nuverxai.com',
    password: 'Ly210!',
    roleKey: 'marketingStaff',
    lastActive: '23/12/2024, 14:10',
    createdAt: '18/03/2026',
    createdBy: 'Phương Thảo',
    status: 'disabled',
  },
  {
    id: 'u-8',
    fullName: 'Phạm Quỳnh Anh',
    email: 'anh.pqa@nuverxai.com',
    password: 'Anh210!',
    roleKey: 'marketingStaff',
    lastActive: '18/12/2024, 09:20',
    createdAt: '19/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-9',
    fullName: 'Nguyễn Thành Nam',
    email: 'nam.nt@nuverxai.com',
    password: 'Nam210!',
    roleKey: 'marketingStaff',
    lastActive: '01/12/2024, 17:45',
    createdAt: '20/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-10',
    fullName: 'Đỗ Khánh Huyền',
    email: 'huyen.dkh@nuverxai.com',
    password: 'Huyen210!',
    roleKey: 'marketingStaff',
    lastActive: '28/11/2024, 08:00',
    createdAt: '21/03/2026',
    createdBy: 'Phương Thảo',
    status: 'disabled',
  },
  {
    id: 'u-11',
    fullName: 'Bùi Gia Bảo',
    email: 'bao.bgb@nuverxai.com',
    password: 'Bao210!',
    roleKey: 'marketingStaff',
    lastActive: '17/11/2024, 11:30',
    createdAt: '22/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-12',
    fullName: 'Trương Huy Hoàng',
    email: 'hoang.thh@nuverxai.com',
    password: 'Hoang210!',
    roleKey: 'marketingStaff',
    lastActive: '11/11/2024, 09:05',
    createdAt: '23/03/2026',
    createdBy: 'Phương Thảo',
    status: 'disabled',
  },
  {
    id: 'u-13',
    fullName: 'Ngô Ánh Tuyết',
    email: 'tuyet.nat@nuverxai.com',
    password: 'Tuyet210!',
    roleKey: 'marketingStaff',
    lastActive: '05/11/2024, 16:12',
    createdAt: '24/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
  {
    id: 'u-14',
    fullName: 'Lâm Nhật Phương',
    email: 'phuong.lnp@nuverxai.com',
    password: 'Phuong210!',
    roleKey: 'marketingStaff',
    lastActive: '29/10/2024, 10:10',
    createdAt: '25/03/2026',
    createdBy: 'Phương Thảo',
    status: 'active',
  },
]

function formatTimestamp(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

const USERS_STORAGE_KEY = 'nvx-dashboard-users'

function isStoredUser(value: unknown): value is ManagedUser {
  if (!value || typeof value !== 'object') return false
  const u = value as Record<string, unknown>
  return (
    typeof u.id === 'string' &&
    typeof u.fullName === 'string' &&
    typeof u.email === 'string' &&
    typeof u.password === 'string' &&
    typeof u.roleKey === 'string' &&
    typeof u.lastActive === 'string' &&
    typeof u.createdAt === 'string' &&
    typeof u.createdBy === 'string' &&
    (u.status === 'active' || u.status === 'disabled')
  )
}

function getStoredUsers(): ManagedUser[] {
  if (typeof window === 'undefined') return INITIAL_USERS
  try {
    const raw = window.sessionStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return INITIAL_USERS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return INITIAL_USERS
    const valid = parsed.filter(isStoredUser)
    return valid.length > 0 ? valid : INITIAL_USERS
  } catch {
    return INITIAL_USERS
  }
}

function persistUsersToStorage(users: ManagedUser[]) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function UserManagementPage() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const [newFullName, setNewFullName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('marketingStaff')
  const [newDisabled, setNewDisabled] = useState(false)
  const [detailFullName, setDetailFullName] = useState('')
  const [detailEmail, setDetailEmail] = useState('')
  const [detailRole, setDetailRole] = useState<UserRole>('marketingStaff')
  const [detailDisabled, setDetailDisabled] = useState(false)
  const { toast } = useToast()
  const generatedPassword = useMemo(() => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6).toUpperCase(), [])

  useEffect(() => {
    setUsers(getStoredUsers())
  }, [])

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  )

  const hasDetailChanges = useMemo(() => {
    if (!selectedUser) return false

    return (
      detailFullName.trim() !== selectedUser.fullName ||
      detailEmail.trim() !== selectedUser.email ||
      detailRole !== selectedUser.roleKey ||
      detailDisabled !== (selectedUser.status === 'disabled')
    )
  }, [detailDisabled, detailEmail, detailFullName, detailRole, selectedUser])

  const roleLabels = useMemo<Record<UserRole, string>>(
    () => ({
      cskhStaff: t.dashboard.users.roles.marketingStaff,
      operationsManager: t.dashboard.users.roles.marketingStaff,
      salesStaff: t.dashboard.users.roles.marketingStaff,
      marketingStaff: t.dashboard.users.roles.marketingStaff,
    }),
    [t],
  )

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    return users.filter((user) => {
      const roleLabel = roleLabels[user.roleKey]
      const matchesQuery =
        normalizedQuery.length === 0 ||
        user.fullName.toLocaleLowerCase().includes(normalizedQuery) ||
        roleLabel.toLocaleLowerCase().includes(normalizedQuery)

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter

      let matchesDate = true
      if (dateFilter) {
        const match = user.lastActive.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
        if (match) {
          matchesDate =
            Number(match[1]) === dateFilter.getDate() &&
            Number(match[2]) - 1 === dateFilter.getMonth() &&
            Number(match[3]) === dateFilter.getFullYear()
        } else {
          matchesDate = false
        }
      }

      return matchesQuery && matchesStatus && matchesDate
    })
  }, [users, searchQuery, statusFilter, roleLabels, dateFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const pageNumbers = useMemo(() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const pages: number[] = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) {
      pages.push(-1)
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page)
    }

    if (end < totalPages - 1) {
      pages.push(-2)
    }

    pages.push(totalPages)

    return pages
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (!selectedUser) return

    setDetailFullName(selectedUser.fullName)
    setDetailEmail(selectedUser.email)
    setDetailRole(selectedUser.roleKey)
    setDetailDisabled(selectedUser.status === 'disabled')
  }, [selectedUser])


  const handleAddUser = () => {
    setNewFullName('')
    setNewEmail('')
    setNewRole('marketingStaff')
    setNewDisabled(false)
    setIsCreateDialogOpen(true)
  }

  const handleCreateUser = () => {
    if (!newFullName.trim()) return
    const newUser: ManagedUser = {
      id: `u-${Date.now()}`,
      fullName: newFullName.trim(),
      email: newEmail.trim() || `${newFullName.trim().toLowerCase().replace(/\s+/g, '.')}@nuverxai.com`,
      password: generatedPassword,
      roleKey: newRole,
      lastActive: formatTimestamp(new Date()),
      createdAt: formatTimestamp(new Date()).split(',')[0],
      createdBy: 'Phương Thảo',
      status: newDisabled ? 'disabled' : 'active',
    }
    setUsers((currentUsers) => {
      const nextUsers = [newUser, ...currentUsers]
      persistUsersToStorage(nextUsers)
      return nextUsers
    })
    setCurrentPage(1)
    setIsCreateDialogOpen(false)
  }

  const handleSaveUserDetails = () => {
    if (!selectedUser) return

    setUsers((currentUsers) => {
      const nextUsers = currentUsers.map((user) => {
        if (user.id !== selectedUser.id) {
          return user
        }

        const nextStatus: UserStatus = detailDisabled ? 'disabled' : 'active'

        return {
          ...user,
          fullName: detailFullName.trim(),
          email: detailEmail.trim(),
          roleKey: detailRole,
          status: nextStatus,
        }
      })

      persistUsersToStorage(nextUsers)
      return nextUsers
    })

    toast({
      duration: 2200,
      className: 'border border-[#bfdbfe] bg-white shadow-[0_14px_30px_rgba(37,99,235,0.18)] rounded-xl px-4 py-3',
      title: 'Cập nhật thành công',
      description: 'Thông tin tài khoản đã được lưu.',
    })

    handleDetailDialogChange(false)
  }

  const handleOpenUserDetails = (userId: string) => {
    setSelectedUserId(userId)
    setIsDetailDialogOpen(true)
  }

  const handleDetailDialogChange = (open: boolean) => {
    setIsDetailDialogOpen(open)
    if (!open) {
      setSelectedUserId(null)
      setDetailFullName('')
      setDetailEmail('')
      setDetailRole('marketingStaff')
      setDetailDisabled(false)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#181819]">{t.dashboard.users.title}</h1>
            <p className="mt-1 text-sm text-[#6b7280]">{t.dashboard.users.subtitle}</p>
          </div>
        </header>

        <section className="rounded-[24px] border border-[#d6d7da] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
          <ListToolbar
            searchInputId="users-search-input"
            searchLabel={t.dashboard.users.searchPlaceholder}
            searchPlaceholder={t.dashboard.users.searchPlaceholder}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterSelectId="users-status-filter"
            filterLabel={t.dashboard.users.statusFilterLabel}
            filterValue={statusFilter}
            onFilterChange={(value) => setStatusFilter(value as UserFilter)}
            filterOptions={[
              { value: 'all', label: t.dashboard.users.filters.all },
              { value: 'active', label: t.dashboard.users.filters.active },
              { value: 'disabled', label: t.dashboard.users.filters.disabled },
            ]}
            calendarButtonId="users-calendar-button"
            calendarAriaLabel="Lọc theo ngày"
            onCalendarButtonClick={() => setIsCalendarOpen(true)}
            resetButtonId="users-reset-date-filter"
            resetButtonLabel="Đặt lại"
            onResetButtonClick={() => {
              setDateFilter(null)
              setCurrentPage(1)
            }}
            showResetButton={dateFilter !== null}
            addButtonId="users-add-user-button"
            addButtonAriaLabel={t.dashboard.users.addUser}
            onAddButtonClick={handleAddUser}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] table-fixed border-separate border-spacing-y-4">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[28%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr>
                  <th className="px-4 text-center text-base font-medium text-[#181819]">{t.dashboard.users.table.fullName}</th>
                  <th className="px-4 text-center text-base font-medium text-[#181819]">{t.dashboard.users.table.role}</th>
                  <th className="px-4 text-center text-base font-medium text-[#181819]">{t.dashboard.users.table.time}</th>
                  <th className="px-4 text-center text-base font-medium text-[#181819]">{t.dashboard.users.table.status}</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="rounded-[16px] bg-[#f8fafc] px-4 py-10 text-center text-sm text-[#6b7280]"
                    >
                      {t.dashboard.users.emptyState}
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="cursor-pointer bg-[#f4f9fd] transition-colors hover:bg-[#eaf3fb]"
                      onClick={() => handleOpenUserDetails(user.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleOpenUserDetails(user.id)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <td className="rounded-l-[24px] px-4 py-0 align-middle text-sm text-[#181819]">
                        <div className="flex h-[56px] items-center justify-center text-center">
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-4 py-0 align-middle text-sm text-[#181819]">
                        <div className="flex h-[56px] items-center justify-center text-center">
                          {roleLabels[user.roleKey]}
                        </div>
                      </td>
                      <td className="px-4 py-0 align-middle">
                        <div className="flex h-[56px] items-center justify-center">
                          <TimestampChip value={user.lastActive} />
                        </div>
                      </td>
                      <td className="rounded-r-[24px] px-4 py-0 align-middle">
                        <div className="flex h-[56px] items-center justify-center">
                          <span
                            className={`inline-flex min-h-[31px] min-w-[98px] items-center justify-center rounded-[14px] px-3 text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-[#3980ea] text-white'
                                : 'bg-[#fa07074d] text-black'
                            }`}
                          >
                            {user.status === 'active'
                              ? t.dashboard.users.filters.active
                              : t.dashboard.users.filters.disabled}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              id="users-pagination-prev"
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label={t.dashboard.users.pagination.previous}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-[#181819] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:text-[#9ca3af]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {pageNumbers.map((pageNumber, index) =>
              pageNumber < 0 ? (
                <span key={`ellipsis-${index}`} className="inline-flex w-8 items-center justify-center text-sm text-[#6b7280]">
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  id={`users-pagination-page-${pageNumber}`}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex h-10 min-w-[32px] items-center justify-center rounded-[4px] px-2 text-sm transition-colors ${
                    pageNumber === currentPage
                      ? 'bg-[#5657581f] font-medium text-[#181819]'
                      : 'text-[#181819] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              id="users-pagination-next"
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label={t.dashboard.users.pagination.next}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-[#181819] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:text-[#9ca3af]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        <DatePickerModal
          open={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          selectedDate={dateFilter}
          onConfirm={(date) => {
            setDateFilter(date)
            setCurrentPage(1)
          }}
        />

        <Dialog open={isDetailDialogOpen} onOpenChange={handleDetailDialogChange}>
          <DialogContent
            showCloseButton={false}
            lockScroll={false}
            className="overflow-hidden rounded-[16px] border-0 p-0 shadow-[0_24px_70px_rgba(15,23,42,0.24)] sm:max-w-[500px]"
          >
            <DialogTitle className="sr-only">Cập nhật tài khoản</DialogTitle>
            <DialogDescription className="sr-only">
              Cập nhật thông tin và trạng thái tài khoản người dùng.
            </DialogDescription>
            {selectedUser ? (
              <>
                <div className="flex items-center justify-between bg-[#3f8cff] px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">Cập nhật tài khoản</h2>
                  <button
                    type="button"
                    onClick={() => handleDetailDialogChange(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                  >
                    <span className="text-xl leading-none">&times;</span>
                  </button>
                </div>

                <div className="space-y-5 bg-white px-6 py-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#6b7280]">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                      <input
                        id="user-detail-fullname"
                        type="text"
                        value={detailFullName}
                        onChange={(event) => setDetailFullName(event.target.value)}
                        className="h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#111827] outline-none transition-colors focus:border-[#3f8cff]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#6b7280]">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="user-detail-email"
                      type="email"
                      value={detailEmail}
                      onChange={(event) => setDetailEmail(event.target.value)}
                      className="h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111827] outline-none transition-colors focus:border-[#3f8cff] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#6b7280]">Mật khẩu (hệ thống sinh)</label>
                    <input
                      id="user-detail-password"
                      type="text"
                      readOnly
                      value={selectedUser.password}
                      className="h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-[#f3f4f6] px-4 text-sm text-[#c0c4cc] outline-none"
                    />
                  </div>

                  <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-sm font-medium text-[#6b7280]">Vai Trò</label>
                      <div className="relative">
                        <select
                          id="user-detail-role"
                          value={detailRole}
                          onChange={(event) => setDetailRole(event.target.value as UserRole)}
                          className="h-10 w-full appearance-none rounded-[6px] border border-[#e5e7eb] bg-white px-3 pr-10 text-sm font-medium text-[#111827] outline-none transition-colors focus:border-[#3f8cff]"
                        >
                          <option value="marketingStaff">{roleLabels.marketingStaff}</option>
                        </select>
                        <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#111827]" />
                      </div>
                    </div>
                    <div className="flex h-12 min-w-[196px] items-center justify-between gap-5 rounded-[14px] border border-[#e5eef9] bg-[linear-gradient(180deg,#f8fbff_0%,#edf5ff_100%)] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <span className="text-sm font-semibold text-[#111827]">Vô hiệu hóa tài khoản</span>
                      <Switch
                        id="user-detail-disabled"
                        checked={detailDisabled}
                        onCheckedChange={setDetailDisabled}
                        className="h-7 w-12 rounded-full border border-[#d6e4ff] bg-[linear-gradient(180deg,#edf4ff_0%,#dbeafe_100%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),inset_0_-1px_3px_rgba(59,130,246,0.12)] transition-all duration-300 data-[state=checked]:border-[#94a3b8] data-[state=checked]:bg-[linear-gradient(180deg,#94a3b8_0%,#64748b_100%)] data-[state=unchecked]:border-[#bfdbfe] data-[state=unchecked]:bg-[linear-gradient(180deg,#60a5fa_0%,#3b82f6_100%)] [&>span]:size-6 [&>span]:bg-white [&>span]:shadow-[0_3px_10px_rgba(15,23,42,0.22)] [&>span]:ring-1 [&>span]:ring-[#dbeafe] [&>span]:transition-all [&>span]:duration-300 data-[state=checked]:[&>span]:ring-[#cbd5e1]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 pt-2 text-xs text-[#9ca3af]">
                    <span>Tạo vào: {selectedUser.createdAt}</span>
                    <span>Tạo bởi: {selectedUser.createdBy}</span>
                  </div>

                  {hasDetailChanges ? (
                    <div className="flex justify-end pt-1">
                      <button
                        id="user-detail-update"
                        type="button"
                        onClick={handleSaveUserDetails}
                        disabled={!detailFullName.trim() || !detailEmail.trim()}
                        className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-[10px] bg-[#3f8cff] px-6 text-sm font-semibold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cập nhật
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent
            showCloseButton={false}
            lockScroll={false}
            className="overflow-hidden rounded-[16px] border-0 p-0 shadow-[0_24px_70px_rgba(15,23,42,0.24)] sm:max-w-[500px]"
          >
            <DialogTitle className="sr-only">Tạo tài khoản</DialogTitle>
            <DialogDescription className="sr-only">
              Nhập thông tin cần thiết để tạo tài khoản người dùng mới.
            </DialogDescription>
            <div className="flex items-center justify-between bg-[#3f8cff] px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Tạo tài khoản</h2>
              <button
                type="button"
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

            <div className="space-y-5 bg-white px-6 py-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    id="create-user-fullname"
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="h-10 w-full rounded-[10px] border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#111827] outline-none transition-colors focus:border-[#3f8cff]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-user-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="@nuverxai.com"
                  className="h-10 w-full rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#3f8cff] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#374151]">Mật khẩu (hệ thống sinh)</label>
                <input
                  type="text"
                  readOnly
                  value=""
                  className="h-10 w-full rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] px-4 text-sm text-[#6b7280] outline-none"
                />
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#374151]">Vai Trò</label>
                  <select
                    id="create-user-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="h-10 w-full rounded-[10px] border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#3f8cff]"
                  >
                    <option value="marketingStaff">Nhân sự Marketing</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 rounded-[14px] border border-[#e5eef9] bg-[linear-gradient(180deg,#f8fbff_0%,#edf5ff_100%)] px-5 py-2.5">
                  <span className="text-sm font-medium text-[#374151]">Vô hiệu hóa tài khoản</span>
                  <Switch
                    id="create-user-disabled"
                    checked={newDisabled}
                    onCheckedChange={setNewDisabled}
                    className="h-7 w-12 rounded-full border border-[#d6e4ff] bg-[linear-gradient(180deg,#edf4ff_0%,#dbeafe_100%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),inset_0_-1px_3px_rgba(59,130,246,0.12)] transition-all duration-300 data-[state=checked]:border-[#94a3b8] data-[state=checked]:bg-[linear-gradient(180deg,#94a3b8_0%,#64748b_100%)] data-[state=unchecked]:border-[#bfdbfe] data-[state=unchecked]:bg-[linear-gradient(180deg,#60a5fa_0%,#3b82f6_100%)] [&>span]:size-6 [&>span]:bg-white [&>span]:shadow-[0_3px_10px_rgba(15,23,42,0.22)] [&>span]:ring-1 [&>span]:ring-[#dbeafe] [&>span]:transition-all [&>span]:duration-300 data-[state=checked]:[&>span]:ring-[#cbd5e1]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  id="create-user-submit"
                  type="button"
                  onClick={handleCreateUser}
                  disabled={!newFullName.trim()}
                  className="inline-flex h-10 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3f8cff] px-6 text-sm font-semibold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tạo
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
