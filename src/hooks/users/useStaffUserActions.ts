import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { UserApi } from '@/api/generated/apis'
import { ResponseError } from '@/api/generated/runtime'
import { readAuthSession } from '@/lib/auth/auth-session'
import type { CreateUserFormValues } from '@/types/user/userSchemas'
import { userQueryKeys } from './useStaffUsers'

/**
 * Hook for user mutations (create)
 */
export function useUserActions() {
  const queryClient = useQueryClient()
  const userApi = getAuthenticatedApi(UserApi)

  const fetchUsersRaw = async (): Promise<Array<{ id?: string; email?: string; username?: string }>> => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
    const token = readAuthSession().token

    const response = await fetch(`${base}/api/user?page=0&size=1000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    })

    if (!response.ok) return []

    const json = (await response.json().catch(() => null)) as unknown
    if (!json || typeof json !== 'object') return []

    const data = (json as { data?: unknown }).data
    if (!Array.isArray(data)) return []

    return data.map((item) => {
      if (!item || typeof item !== 'object') return {}
      const obj = item as Record<string, unknown>
      return {
        id: typeof obj.id === 'string' ? obj.id : undefined,
        email: typeof obj.email === 'string' ? obj.email : undefined,
        username: typeof obj.username === 'string' ? obj.username : undefined,
      }
    })
  }

  const findExistingUserIdByUsername = async (username: string): Promise<string | null> => {
    const normalizedUsername = username.trim().toLowerCase()
    if (!normalizedUsername) return null

    const rawUsers = await fetchUsersRaw()
    const rawMatch = rawUsers.find((user) => {
      const candidateUsername = user.username?.trim().toLowerCase()
      const candidateEmail = user.email?.trim().toLowerCase()
      return candidateUsername === normalizedUsername || candidateEmail === normalizedUsername
    })

    if (rawMatch?.id) return rawMatch.id

    const usersResponse = await userApi.getAllUsers({
      pageable: { page: 0, size: 1000 },
    })

    if (!usersResponse.success || !Array.isArray(usersResponse.data)) {
      return null
    }

    const typedMatch = usersResponse.data.find((user) => {
      const candidateEmail = (user as { email?: string }).email?.trim().toLowerCase()
      const candidateUsername = (user as { username?: string }).username?.trim().toLowerCase()
      return candidateEmail === normalizedUsername || candidateUsername === normalizedUsername
    })

    return typedMatch?.id ?? null
  }

  const createUserByUsername = async (values: CreateUserFormValues) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
    const token = readAuthSession().token

    const response = await fetch(`${base}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({
        username: values.username.trim(),
        password: values.password,
        roles: [],
      }),
    })

    if (!response.ok) {
      throw new ResponseError(response, 'Response returned an error code')
    }

    return response.json()
  }

  const createUserByEmailCompat = async (values: CreateUserFormValues) => {
    return userApi.createUser({
      userPostDTO: {
        email: values.username.trim(),
        password: values.password,
        roles: [],
      },
    })
  }

  const createUser = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      const username = values.username.trim()

      const existingBeforeCreateId = await findExistingUserIdByUsername(username)
      if (existingBeforeCreateId) {
        return userApi.getUser({ id: existingBeforeCreateId })
      }

      try {
        const response = await createUserByUsername(values)
        return response
      } catch (error) {
        if (error instanceof ResponseError) {
          if (error.response.status >= 500) {
            try {
              const compatResponse = await createUserByEmailCompat(values)
              return compatResponse
            } catch {
              // Continue to existing-user recovery and detailed error parsing
            }

            const existingAfterCreateId = await findExistingUserIdByUsername(username)
            if (existingAfterCreateId) {
              return userApi.getUser({ id: existingAfterCreateId })
            }
          }

          const text = await error.response.text().catch(() => '')
          let message = `Create user failed (${error.response.status})`

          if (text) {
            try {
              const parsed: unknown = JSON.parse(text)
              if (parsed && typeof parsed === 'object') {
                const obj = parsed as { message?: unknown; errors?: unknown }
                if (typeof obj.message === 'string' && obj.message.trim()) {
                  message = obj.message
                } else if (Array.isArray(obj.errors) && obj.errors.length > 0) {
                  const first = obj.errors[0]
                  if (first && typeof first === 'object') {
                    const desc = (first as { description?: unknown }).description
                    if (typeof desc === 'string' && desc.trim()) {
                      message = desc
                    }
                  }
                }
              }
            } catch {
              message = `${message}: ${text}`
            }
          }

          if (message === 'An internal error occurred') {
            throw new Error('Unable to create user login. The server returned an internal error. Check if this username already exists.')
          }

          throw new Error(message)
        }

        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys })
    },
  })

  return {
    createUser,
  }
}
