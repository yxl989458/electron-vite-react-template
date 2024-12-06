import { createHashRouter, useRouteError } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import App from '../App'

// 懒加载组件
const HomePage = lazy(() => import('../pages/Home'))
const CanvasWrapper = lazy(() => import('../canvasWrapperPlan'))

// 加载状态组件
function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )
}

// 错误边界组件
function ErrorBoundary() {
  const error = useRouteError()
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">抱歉，出现了一些问题</h1>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : '页面未找到'}
        </p>
      </div>
    </div>
  )
}

// 占位页面组件
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  )
}

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: '/ai-apps',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CanvasWrapper />
          </Suspense>
        )
      },
      {
        path: '/ai-plugins',
        element: <PlaceholderPage title="AI Plugins" />
      },
      {
        path: '/create-image',
        element: <PlaceholderPage title="Create Image" />
      },
      {
        path: '/models',
        element: <PlaceholderPage title="Models" />
      },
      {
        path: '/comfyui',
        element: <PlaceholderPage title="ComfyUI" />
      },
      {
        path: '/my-works',
        element: <PlaceholderPage title="My Works" />
      },
      {
        path: '/posts',
        element: <PlaceholderPage title="Posts" />
      }
    ]
  }
])