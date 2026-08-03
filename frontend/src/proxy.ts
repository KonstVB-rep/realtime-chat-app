import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Пропускаем статические файлы и системные пути Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Всегда запускаем для путей Clerk
    '/__clerk/:path*',
    // Защищаем API и TRPC (если будут)
    '/(api|trpc)(.*)',
  ],
}