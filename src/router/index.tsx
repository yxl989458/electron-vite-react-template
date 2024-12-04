import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/Home'
import CanvasWrapperPlan from '@/canvasWrapperPlan'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/ai-apps',
        element: <div>AI Apps</div>,
      },
      {
        path: '/ai-plugins',
        element: <div>AI Plugins</div>,
      },
      {
        path: '/create-image',
        element: <div>Create Image</div>,
      },
      {
        path: '/models',
        element: <div>Models</div>,
      },
      {
        path: '/comfyui',
        element: <div>ComfyUI</div>,
      },
      {
        path: '/my-works',
        element: <div>My Works</div>,
      },
      {
        path: '/posts',
        element: <div>Posts</div>,
      },
    ],
  },
]) 