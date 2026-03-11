import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { UserApi } from '@/api/generated/apis'
import type { UserTableDTO } from '@/api/generated/models'
import { ResponseError } from '@/api/generated/runtime'
import type { CreateUserFormValues } from '@/types/user/userSchemas'
import { userQueryKeys } from './useStaffUsers'

const userApi = getAuthenticatedApi(UserApi)

export function useUserActions() {
  const queryClient = useQueryClient()

  const findExistingUserByUsername = async (username: string): Promise<UserTableDTO | null> => {
    const normalized = username.trim().toLowerCase()
    if (!normalized) return null

    const res = await userApi.getAllUsers({ pageable: { page: 0, size: 1000 } })
    if (!res.success || !Array.isArray(res.data)) return null

    return (
      res.data.find((user) => user.username.trim().toLowerCase() === normalized) ?? null
    )
  }

  const createUser = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      const username = values.username.trim()

      const existing = await findExistingUserByUsername(username)
      if (existing) {
        return userApi.getUser({ id: existing.id })
      }

      try {
        return await userApi.createUser({
          userPostDTO: {
            username,
            password: values.password,
            roles: values.roleIds ?? [],
          },
        })
      } catch (error) {
        if (error instanceof ResponseError) {
          const text = await error.response.text().catch(() => '')
          let message = `Create user failed (${error.response.status})`
          try {
            const parsed = text.trim() ? (JSON.parse(text) as Record<string, unknown>) : null
            if (typeof parsed?.message === 'string' && parsed.message.trim()) {
              message = parsed.message
            } else if (Array.isArray(parsed?.errors) && parsed.errors.length > 0) {
              const first = parsed.errors[0] as Record<string, unknown>
              if (typeof first?.description === 'string') message = first.description
            } else if (typeof parsed?.error === 'string') {
              message = parsed.error
            } else if (typeof parsed?.detail === 'string') {
              message = parsed.detail
            }
          } catch { /* ignore parse errors */ }
          throw new Error(message)
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys })
    },
  })

  return { createUser }
}
