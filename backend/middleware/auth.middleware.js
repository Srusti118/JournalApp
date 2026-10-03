import { fromNodeHeaders } from 'better-auth/node'   //bridges the node headers to web standard
import { auth } from '../config/auth.js'
import { verifyAccessToken } from '../services/token.service.js'
import { User } from '../models/user.model.js'
import { AppError } from './errorHandler.js'

// CSRF protection middleware
export const verifyCsrf = (req, res, next) => {
  const csrfTokenFromCookie = req.cookies?.csrfToken
  const csrfTokenFromHeader = req.headers['x-csrf-token']

  if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
    return next(new AppError('CSRF token missing', 403, 'CSRF_MISSING'))
  }

  if (csrfTokenFromCookie !== csrfTokenFromHeader) {
    return next(new AppError('Invalid CSRF token', 403, 'CSRF_INVALID'))
  }

  next()
}

// Authentication middleware (Better Auth session first, fallback to legacy JWT)
export const protect = async (req, res, next) => {
  try {
    // 1. Check Better Auth session (cookies or session bearer token)
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (session?.user) {
      req.user = {
        ...session.user,
        _id: session.user.id,
      }
      req.session = session.session
      return next()
    }

    // 2. Fallback to manual JWT Bearer authentication
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.userId).select('-password')
        if (user) {
          req.user = user
          return next()
        }
      } catch (jwtError) {
        // Fall through to unauthorized
      }
    }

    return next(new AppError('Unauthorized: No valid session found', 401, 'UNAUTHORIZED'))
  } catch (error) {
    return next(new AppError('Authentication failed', 401, 'AUTH_FAILED'))
  }
}

// Combined middleware for protected routes with CSRF
export const protectWithCsrf = [verifyCsrf, protect]