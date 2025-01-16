import { useLocation, useNavigate } from '@remix-run/react'

export const useRouter = () => {
  const navigate = useNavigate()

  const location = useLocation()

  return {
    push: (path: string) => {
      if (location.pathname + location.search === path) return

      navigate(path)
    },
  }
}